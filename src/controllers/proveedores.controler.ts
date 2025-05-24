import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { ZodError, z } from "zod";
import {
  proveedor,
  postProveedorSchema,
  putProveedorSchema,
  proveedorSchema,
  idParamsProveedoresSchema,
} from "../schemas/proveedores.schema";

export const getProveedores = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await pool.query(
      "SELECT * FROM proveedores WHERE estado = 1"
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "No hay proveedores registrados" });
    }

    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getProveedorById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM proveedores WHERE id_proveedor = ? AND estado = 1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const postProveedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postProveedorSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ msg: "Error de validación", errors: error.errors });
    }
  }

  const { descripcion, razon_social, ruc, direccion, estado } =
    req.body as proveedor;

  try {
    await pool.query(
      "INSERT INTO proveedores (descripcion, razon_social, ruc, direccion, estado) VALUES (?, ?, ?, ?, ?)",
      [descripcion, razon_social, ruc, direccion, estado]
    );
    res.status(201).json({ msg: "Proveedor creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const putProveedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    putProveedorSchema.parse(req.body);
    idParamsProveedoresSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ msg: "Error de validación", errors: error.errors });
    }
  }

  const { id } = req.params;
  const { descripcion, razon_social, ruc, direccion, estado } =
    req.body as proveedor;

  try {
    const [result]: any = await pool.query(
      "UPDATE proveedores SET descripcion = IFNULL(?, descripcion), razon_social = IFNULL(?, razon_social), ruc = IFNULL(?, ruc), direccion = IFNULL(?, direccion), estado = IFNULL(?, estado) WHERE id_proveedor = ?",
      [descripcion, razon_social, ruc, direccion, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    res.json({ msg: "Proveedor actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteProveedor = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsProveedoresSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ msg: "Error de validación", errors: error.errors });
    }
  }

  const { id } = req.params;

  try {
    const [result]: any = await pool.query(
      "UPDATE proveedores SET estado = 0 WHERE id_proveedor = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Proveedor no encontrado" });
    }

    res.status(200).json({ msg: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
