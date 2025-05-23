import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  postRegistroClinicoSchema,
  putRegistroClinicoSchema,
  registroClinico,
} from "../schemas/registroClinicos.schema";
import { idParamsVacunaSchema } from "../schemas/vacunas.schema"; // reutilizado para validar el ID

// Obtener todos los registros clínicos activos
export const getRegistrosClinicos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM registros_clinicos WHERE estado = 1");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

// Obtener un registro clínico por ID
export const getRegistroClinicoById = async (req: Request, res: Response)  : Promise<any> => {
  try {
    idParamsVacunaSchema.parse(req.params);
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
      "SELECT * FROM registros_clinicos WHERE id_registro_clinico = ? AND estado = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "No existe el registro clínico" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

// Crear un nuevo registro clínico
export const postRegistroClinico = async (req: Request, res: Response) : Promise<any> => {
  try {
    postRegistroClinicoSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { Descripcion, fecha, id_cliente, estado = true } = req.body as registroClinico;

  try {
    await pool.query(
      "INSERT INTO registros_clinicos (Descripcion, fecha, id_cliente, estado) VALUES (?, ?, ?, ?)",
      [Descripcion, fecha, id_cliente, estado]
    );

    res.status(201).json({
      Descripcion,
      fecha,
      id_cliente,
      estado,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar un registro clínico
export const putRegistroClinico = async (req: Request, res: Response) : Promise<any> => {
  try {
    putRegistroClinicoSchema.parse(req.body);
    idParamsVacunaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const { Descripcion, fecha, id_cliente, estado } = req.body as registroClinico;

  try {
    const [result]: any = await pool.query(
      `UPDATE registros_clinicos SET 
        Descripcion = IFNULL(?, Descripcion), 
        fecha = IFNULL(?, fecha), 
        id_cliente = IFNULL(?, id_cliente), 
        estado = IFNULL(?, estado) 
      WHERE id_registro_clinico = ?`,
      [Descripcion, fecha, id_cliente, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe el registro clínico" });
    }

    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM registros_clinicos WHERE id_registro_clinico = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar (borrado lógico) un registro clínico
export const deleteRegistroClinico = async (req: Request, res: Response) : Promise<any> => {
  try {
    idParamsVacunaSchema.parse(req.params);
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
      "UPDATE registros_clinicos SET estado = 0 WHERE id_registro_clinico = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "No existe el registro clínico" });
    }

    res.status(200).json({ msg: "Registro clínico eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};
