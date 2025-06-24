import { Request, Response } from "express";
import { withTransaction } from "../utils/withTransaction";
import {
  postVentaSchema,
  postDetalleVentaSchema,
  getByIdVentaSchema,
  detalleVenta,
  mesSchema,
} from "../schemas/ventas.schema";
import { ZodError } from "zod";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db";
import { log } from "node:console";

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

//consulta de venta con join con view
export const getAllVentaJoin = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "select v.id_venta, c.nombre_apellido as cliente, u.nombre_apellido as usuario, v.fecha_venta, v.total from ventas v inner join clientes c on c.id_cliente = v.id_cliente inner join usuarios u on u.id_usuario = v.id_usuario"
    );

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: "Error del servidor", error });
  }
};

// Obtener venta por ID
export const getDetalleByVentaID = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    getByIdVentaSchema.parse(req.params);
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT d.id_detalle_venta, v.id_venta, p.nombre, u.nombre_apellido, d.precio_unitario, d.cantidad, d.subtotal, d.iva FROM detalle_ventas d inner join ventas v on v.id_venta = d.id_venta inner join usuarios u on u.id_usuario = d.id_usuario inner join productos p on p.id_producto = d.id_producto where d.id_venta = ?",
      [id]
    );
    if (!Array.isArray(rows) || rows.length === 0)
      return res
        .status(404)
        .json({ msg: "Detalle de ventas sin coincidencias" });
    res.json(rows);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ msg: "Validación fallida", error: error.errors });
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

//TODO::
// ventas diarias del mes actual incluyendo días sin ventas.
export const getVentasPorDia = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Validar el query param
    mesSchema.parse(req.query);
    const { mes } = req.query;

    const inicioMes = `${mes}-01`;

    const sql = `
      WITH RECURSIVE dias_del_mes AS (
        SELECT DATE(?) AS fecha
        UNION ALL
        SELECT DATE_ADD(fecha, INTERVAL 1 DAY)
        FROM dias_del_mes
        WHERE MONTH(fecha) = MONTH(?)
      )
      SELECT 
        d.fecha,
        IFNULL(SUM(dv.subtotal), 0) AS total
      FROM dias_del_mes d
      LEFT JOIN ventas v ON DATE(v.fecha_venta) = d.fecha
      LEFT JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
      GROUP BY d.fecha
      ORDER BY d.fecha;
    `;

    const [rows] = await pool.query(sql, [inicioMes, inicioMes]);

    res.json(rows);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ msg: "Validación fallida", error: error.errors });
    }

    console.error("Error en getVentasPorDia:", error);
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

//ventas mensuales del año actual
export const getVentasMensuales = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.anio as string) || new Date().getFullYear();
    const sql = `
      SELECT MONTH(v.fecha_venta) AS mes,
             IFNULL(SUM(dv.subtotal), 0) AS total,
             COUNT(DISTINCT v.id_venta) AS ventas_count
      FROM ventas v
      LEFT JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
      WHERE YEAR(v.fecha_venta) = ?
      GROUP BY mes
      ORDER BY mes;
    `;
    const [rows]: any = await pool.query(sql, [year]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en ventas mensuales", err });
  }
};

//total de ventas por mes

export const getTotalVentasPorMes = async (
  req: Request,
  res: Response
): Promise<any> => {
  const mes = typeof req.query.mes === "string" ? req.query.mes : "";

  const formatoMes = /^\d{4}-(0[1-9]|1[0-2])$/;

  if (!formatoMes.test(mes)) {
    return res.status(400).json({ msg: "Mes inválido" });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT IFNULL(SUM(dv.subtotal), 0) AS total
       FROM ventas v
       JOIN detalle_ventas dv ON v.id_venta = dv.id_venta
       WHERE DATE_FORMAT(v.fecha_venta, '%Y-%m') = ?`,
      [mes]
    );

    return res.json(rows[0]); // 👈 retorno explícito siempre
  } catch (err) {
    return res.status(500).json({ msg: "Error en servidor", err });
  }
};
