import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  cirugia,
  idParamsCirugiaSchema,
  postCirugiaSchema,
  putCirugiaSchema,
} from "../schemas/cirugias.schema";

export const getCirugias = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const [rows] = await pool.query("SELECT * FROM cirugias WHERE estado = 1");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getCirugiaById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsCirugiaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM cirugias WHERE id_cirugia = ? AND estado = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "No existe la cirugía" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const postCirugia = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postCirugiaSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const {
    id_cliente,
    fecha_cirugia,
    tipo_cirugia,
    observaciones,
    id_veterinario,
    estado,
  } = req.body as cirugia;

  try {
    const [result]: [any, FieldPacket[]] = await pool.query(
      "INSERT INTO cirugias (id_cliente, fecha_cirugia, tipo_cirugia, observaciones, id_veterinario, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id_cliente,
        fecha_cirugia,
        tipo_cirugia,
        observaciones,
        id_veterinario,
        estado,
      ]
    );

    res.status(201).json({
      id_cliente,
      fecha_cirugia,
      tipo_cirugia,
      observaciones,
      id_veterinario,
      estado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const putCirugia = async (req: Request, res: Response): Promise<any> => {
  try {
    putCirugiaSchema.parse(req.body);
    idParamsCirugiaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const { fecha_cirugia, tipo_cirugia, observaciones, id_veterinario, estado } =
    req.body as cirugia;

  try {
    const [result]: any = await pool.query(
      `UPDATE cirugias SET 
        fecha_cirugia = IFNULL(?, fecha_cirugia),
        tipo_cirugia = IFNULL(?, tipo_cirugia),
        observaciones = IFNULL(?, observaciones),
        id_veterinario = IFNULL(?, id_veterinario),
        estado = IFNULL(?, estado)
      WHERE id_cirugia = ?`,
      [fecha_cirugia, tipo_cirugia, observaciones, id_veterinario, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe la cirugía" });
    }

    const [rows]: any = await pool.query(
      "SELECT * FROM cirugias WHERE id_cirugia = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteCirugia = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsCirugiaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;

  try {
    const [result]: any = await pool.query(
      "UPDATE cirugias SET estado = 0 WHERE id_cirugia = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe la cirugía" });
    }

    res.status(200).json({ msg: "Cirugía eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
