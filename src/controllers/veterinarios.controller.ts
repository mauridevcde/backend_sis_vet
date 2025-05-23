import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  idParamsVeterinarioSchema,
  postVeterinarioSchema,
  putVeterinarioSchema,
  veterinario,
} from "../schemas/veterinarios.schema";

export const getVeterinarios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM veterinarios WHERE estado = 1"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getVeterinariosById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsVeterinarioSchema.parse(req.params);
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
      "SELECT * FROM veterinarios WHERE id_veterinario = ? AND estado = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "No existe el veterinario" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const postVeterinarios = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postVeterinarioSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { nombre_apellido, matricula, estado } = req.body as veterinario;

  try {
    await pool.query(
      "INSERT INTO veterinarios (nombre_apellido, matricula, estado) VALUES (?, ?, ?)",
      [nombre_apellido, matricula, estado]
    );
    res.status(201).json({ nombre_apellido, matricula, estado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const putVeterinarios = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    putVeterinarioSchema.parse(req.body);
    idParamsVeterinarioSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const { nombre_apellido, matricula, estado } = req.body as veterinario;

  try {
    const [result]: any = await pool.query(
      "UPDATE veterinarios SET nombre_apellido = IFNULL(?, nombre_apellido), matricula = IFNULL(?, matricula), estado = IFNULL(?, estado) WHERE id_veterinario = ?",
      [nombre_apellido, matricula, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe el veterinario" });
    }

    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM veterinarios WHERE id_veterinario = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteVeterinarios = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsVeterinarioSchema.parse(req.params);
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
      "UPDATE veterinarios SET estado = 0 WHERE id_veterinario = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe el veterinario" });
    }

    res.status(200).json({ msg: "Veterinario eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
