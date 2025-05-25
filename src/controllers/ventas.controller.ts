import { Request, Response } from "express";
import { withTransaction } from "../utils/withTransaction";
import {
  postVentaSchema,
  postDetalleVentaSchema,
  getByIdVentaSchema,
  detalleVenta,
} from "../schemas/ventas.schema";
import { ZodError } from "zod";
import { FieldPacket, QueryResult, ResultSetHeader } from "mysql2";

//get all ventas
export const getAllVentas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const [ventas] = await withTransaction(async (conn) => {
      return conn.query(`SELECT * FROM ventas`);
    });

    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};

// POST /ventas/completa
export const postVentaCompleta = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { venta, detalles } = req.body;

    postVentaSchema.parse(venta);
    detalles.forEach((d: detalleVenta) => postDetalleVentaSchema.parse(d));

    const result = await withTransaction(async (conn) => {
      const [ventaResult]: [ResultSetHeader, FieldPacket[]] = await conn.query(
        `INSERT INTO ventas (id_cliente, id_usuario, fecha_venta, total, estado, tipo_pago, tipo_venta, subTotal, Iva0, Iva5, Iva10, TotalDescuento, id_caja)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          venta.id_cliente,
          venta.id_usuario,
          venta.fecha_venta,
          venta.total,
          venta.estado,
          venta.tipo_pago,
          venta.tipo_venta,
          venta.subTotal,
          venta.Iva0,
          venta.Iva5,
          venta.Iva10,
          venta.TotalDescuento,
          venta.id_caja || "0",
        ]
      );

      const id_venta = ventaResult.insertId;

      for (const item of detalles) {
        await conn.query(
          `INSERT INTO detalle_ventas (id_venta, id_producto, id_usuario, cantidad, precio_unitario, subtotal, estado, iva)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_venta,
            item.id_producto,
            item.id_usuario,
            item.cantidad,
            item.precio_unitario,
            item.subtotal,
            item.estado || 1,
            item.iva,
          ]
        );

        // Disminuir stock del producto
        //cancelar la venta si no hay stock
        const [stockResult]: any = await conn.query(
          `SELECT stock FROM productos WHERE id_producto = ?`,
          [item.id_producto]
        );

        const stock = stockResult[0]?.stock || 0;
        if (stock < item.cantidad) {
          // Si no hay suficiente stock, enviar un error al frontend con zod.

          res.json({
            msg:
              "No hay suficiente stock para el producto con ID: " +
              item.id_producto,
          });
          // Si no hay suficiente stock, cancelar la venta con un rollback
          throw new Error("No hay suficiente stock para el producto");
        }

        // Actualizar el stock del producto si hay suficiente
        await conn.query(
          `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`,
          [item.cantidad, item.id_producto]
        );
      }

      return { id_venta };
    });

    res.status(201).json({ msg: "Venta registrada con éxito", ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ msg: "Error en validación", errors: error.errors });
    }
    console.error("Error en venta:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
