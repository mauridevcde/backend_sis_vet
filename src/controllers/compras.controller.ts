import { Request, Response } from "express";
import { pool } from "../db";

import {
  compra,
  detalleCompra,
  getByIdCompraSchema,
  postCompraSchema,
  postDetalleCompraSchema,
} from "../schemas/compras.schema";
import { ZodError } from "zod";
import { withTransaction } from "../utils/withTransaction";

// Compras
export const getCompras = async (_: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compras");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

// Obtener compra por ID
export const getCompraById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    getByIdCompraSchema.parse(req.params);
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM compras WHERE id_compra = ?",
      [id]
    );
    if (!Array.isArray(rows) || rows.length === 0)
      return res.status(404).json({ msg: "Compra no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    if (error instanceof ZodError)
      return res
        .status(400)
        .json({ msg: "Validación fallida", error: error.errors });
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

//obtener detalles de compra
export const getDetallesCompra = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM detalle_compras", [id]);
    if (!Array.isArray(rows) || rows.length === 0)
      return res.status(404).json({ msg: "Detalles no encontrados" });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: "Error del servidor", error });
  }
};

// Crear compra y detalles.
export const postCompraCompleta = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Validamos los datos primero
    const { compra, detalles } = req.body;

    postCompraSchema.parse(compra);
    detalles.forEach((detalle: detalleCompra) =>
      postDetalleCompraSchema.parse(detalle)
    );

    const result = await withTransaction(async (conn) => {
      // Insertar en compras
      const [compraResult]: any = await conn.query(
        `INSERT INTO compras (id_proveedor, id_usuario, TotalNeto, estado, fecha_compra, FacturaNro, TipoDeCompra, Iva0, Iva5, Iva10, SubTotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          compra.id_proveedor,
          compra.id_usuario,
          compra.TotalNeto,
          compra.estado,
          compra.fecha_compra,
          compra.FacturaNro,
          compra.TipoDeCompra,
          compra.Iva0,
          compra.Iva5,
          compra.Iva10,
          compra.SubTotal,
        ]
      );

      if (
        !compraResult.insertId ||
        compraResult.insertId == 0 ||
        compraResult.insertId == "" ||
        compraResult.insertId == null ||
        compraResult.insertId == false
      ) {
        throw new Error("no se ha obtenido el id de la compra!!!");
      }

      const id_compra = compraResult.insertId;

      // Insertar detalles
      for (const item of detalles) {
        await conn.query(
          `INSERT INTO detalle_compras (id_compra, id_producto, id_usuario, cantidad, costo, subtotal, iva, CostoMedio)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_compra,
            item.id_producto,
            item.id_usuario,
            item.cantidad,
            item.costo,
            item.subtotal,
            item.iva,
            item.CostoMedio,
          ]
        );
        // Actualizar stock
        await conn.query(
          `UPDATE productos SET stock = stock + ? WHERE id_producto = ?`,
          [item.cantidad, item.id_producto]
        );
      }

      return { id_compra };
    });

    res.status(201).json({
      msg: "Compra y detalles registrados correctamente",
      ...result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de datos",
        errors: error.errors,
      });
    }

    console.error("Error al registrar compra completa:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
