import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  Vacuna,
  idParamsVacunaSchema,
  postVacunaSchema,
  putVacunaSchema,
} from "../schemas/vacunas.schema";

export const getVacunas = async (req: Request, res: Response) : Promise<any> => {
  try {
    const [rows] = await pool.query("SELECT * FROM vacunas WHERE estado = 1");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getVacunaById = async (req: Request, res: Response) : Promise<any> => {
  try {
    idParamsVacunaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ msg: "Validación fallida", errors: error.errors });
    }
  }

  const { id } = req.params;
  try {
    const [rows]: any = await pool.query("SELECT * FROM vacunas WHERE id_vacuna = ? AND estado = 1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Vacuna no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const postVacuna = async (req: Request, res: Response) : Promise<any> => {
  try {
    postVacunaSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ msg: "Validación fallida", errors: error.errors });
    }
  }

  const {
    id_vacuna,
    id_cliente,
    nombre_vacuna,
    fecha_aplicacion,
    proxima_dosis,
    id_veterinario,
    estado,
  } = req.body as Vacuna;

  try {
    await pool.query(
      `INSERT INTO vacunas 
        (id_vacuna, id_cliente, nombre_vacuna, fecha_aplicacion, proxima_dosis, id_veterinario, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id_vacuna,
        id_cliente,
        nombre_vacuna,
        fecha_aplicacion,
        proxima_dosis,
        id_veterinario,
        estado,
      ]
    );
    res.status(201).json({ msg: "Vacuna registrada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const putVacuna = async (req: Request, res: Response) : Promise<any> => {
  try {
    putVacunaSchema.parse(req.body);
    idParamsVacunaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ msg: "Validación fallida", errors: error.errors });
    }
  }

  const { id } = req.params;
  const vacuna = req.body as Partial<Vacuna>;

  try {
    const [result]: any = await pool.query(
      `UPDATE vacunas SET
        id_cliente = IFNULL(?, id_cliente),
        nombre_vacuna = IFNULL(?, nombre_vacuna),
        fecha_aplicacion = IFNULL(?, fecha_aplicacion),
        proxima_dosis = IFNULL(?, proxima_dosis),
        id_veterinario = IFNULL(?, id_veterinario),
        estado = IFNULL(?, estado)
       WHERE id_vacuna = ?`,
      [
        vacuna.id_cliente,
        vacuna.nombre_vacuna,
        vacuna.fecha_aplicacion,
        vacuna.proxima_dosis,
        vacuna.id_veterinario,
        vacuna.estado,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Vacuna no encontrada" });
    }

    const [updated]: [any[], FieldPacket[]] = await pool.query("SELECT * FROM vacunas WHERE id_vacuna = ?", [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteVacuna = async (req: Request, res: Response) : Promise<any> => {
  try {
    idParamsVacunaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ msg: "Validación fallida", errors: error.errors });
    }
  }

  const { id } = req.params;
  try {
    const [result]: any = await pool.query("UPDATE vacunas SET estado = 0 WHERE id_vacuna = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Vacuna no encontrada" });
    }

    res.status(200).json({ msg: "Vacuna eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
