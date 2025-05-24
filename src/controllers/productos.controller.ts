import { Request, Response } from "express";
import { pool } from "../db";
import {
  producto,
  idParamsProductosSchema,
  postProductoSchema,
  putProductoSchema,
} from "../schemas/productos.schema";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";

export const getProductos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE estado = 1");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const getProductoById = async (req: Request, res: Response): Promise<any> => {
  try {
    idParamsProductosSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ? AND estado = 1",
      [id]
    );
    if (rows.length <= 0) {
      return res.status(404).json({ msg: "No existe el producto" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const postProducto = async (req: Request, res: Response): Promise<any> => {
  try {
    postProductoSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const {
    nombre,
    fecha_vencimiento,
    id_proveedor,
    stock,
    precio_compra,
    precio_venta,
    unidad_medida,
    imagen,
    estado = 1,
  } = req.body as producto;

  try {
    const [rows]: [any, FieldPacket[]] = await pool.query(
      "INSERT INTO productos (nombre, fecha_vencimiento, id_proveedor, stock, precio_compra, precio_venta, unidad_medida, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        nombre,
        fecha_vencimiento,
        id_proveedor,
        stock,
        precio_compra,
        precio_venta,
        unidad_medida,
        imagen,
        estado,
      ]
    );
    res.send({
      nombre,
      fecha_vencimiento,
      id_proveedor,
      stock,
      precio_compra,
      precio_venta,
      unidad_medida,
      imagen,
      estado,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const putProducto = async (req: Request, res: Response): Promise<any> => {
  try {
    putProductoSchema.parse(req.body);
    idParamsProductosSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const {
    nombre,
    fecha_vencimiento,
    id_proveedor,
    stock,
    precio_compra,
    precio_venta,
    unidad_medida,
    imagen,
    estado,
  } = req.body as Partial<producto>;

  try {
    const [result]: any = await pool.query(
      "UPDATE productos SET nombre = IFNULL(?, nombre), fecha_vencimiento = IFNULL(?, fecha_vencimiento), id_proveedor = IFNULL(?, id_proveedor), stock = IFNULL(?, stock), precio_compra = IFNULL(?, precio_compra), precio_venta = IFNULL(?, precio_venta), unidad_medida = IFNULL(?, unidad_medida), imagen = IFNULL(?, imagen), estado = IFNULL(?, estado) WHERE id_producto = ?",
      [
        nombre,
        fecha_vencimiento,
        id_proveedor,
        stock,
        precio_compra,
        precio_venta,
        unidad_medida,
        imagen,
        estado,
        id,
      ]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el producto" });
    }

    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteProducto = async (req: Request, res: Response): Promise<any> => {
  try {
    idParamsProductosSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  console.log(id);

  try {
    const [result]: [any, FieldPacket[]] = await pool.query(
      "UPDATE productos SET estado = 0 WHERE id_producto = ?",
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el producto" });
    }

    res.status(200).json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};