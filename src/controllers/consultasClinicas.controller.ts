import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  consultaClinica,
  idParamsConsultaClinicaSchema,
  postConsultaClinicaSchema,
  putConsultaClinicaSchema,
} from "../schemas/consultasClinicas.schema";

export const getConsultasClinicas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM consultas_clinicas WHERE estado = 1"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const getConsultaClinicaById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsConsultaClinicaSchema.parse(req.params);
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
      "SELECT * FROM consultas_clinicas WHERE id_consulta = ? AND estado = 1",
      [id]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ msg: "No existe la consulta clínica" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const postConsultaClinica = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postConsultaClinicaSchema.parse(req.body);
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
    fecha_consulta,
    motivo,
    sintomas,
    diagnostico,
    tratamiento,
    observaciones,
    peso_kg,
    temperatura_c,
    id_veterinario,
    estado,
  } = req.body as consultaClinica;

  try {
    const [result]: [any, FieldPacket[]] = await pool.query(
      `INSERT INTO consultas_clinicas 
      (id_cliente, fecha_consulta, motivo, sintomas, diagnostico, tratamiento, observaciones, peso_kg, temperatura_c, id_veterinario, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        fecha_consulta,
        motivo,
        sintomas,
        diagnostico,
        tratamiento,
        observaciones,
        peso_kg,
        temperatura_c,
        id_veterinario,
        estado,
      ]
    );

    res.status(201).json({ msg: "Consulta clínica registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const putConsultaClinica = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    putConsultaClinicaSchema.parse(req.body);
    idParamsConsultaClinicaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validación de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const {
    id_cliente,
    fecha_consulta,
    motivo,
    sintomas,
    diagnostico,
    tratamiento,
    observaciones,
    peso_kg,
    temperatura_c,
    id_veterinario,
    estado,
  } = req.body as consultaClinica;

  try {
    const [result]: any = await pool.query(
      `UPDATE consultas_clinicas SET 
      id_cliente = IFNULL(?, id_cliente),
      fecha_consulta = IFNULL(?, fecha_consulta),
      motivo = IFNULL(?, motivo),
      sintomas = IFNULL(?, sintomas),
      diagnostico = IFNULL(?, diagnostico),
      tratamiento = IFNULL(?, tratamiento),
      observaciones = IFNULL(?, observaciones),
      peso_kg = IFNULL(?, peso_kg),
      temperatura_c = IFNULL(?, temperatura_c),
      id_veterinario = IFNULL(?, id_veterinario),
      estado = IFNULL(?, estado)
      WHERE id_consulta = ?`,
      [
        id_cliente,
        fecha_consulta,
        motivo,
        sintomas,
        diagnostico,
        tratamiento,
        observaciones,
        peso_kg,
        temperatura_c,
        id_veterinario,
        estado,
        id,
      ]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe la consulta clínica" });
    }

    const [updated]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM consultas_clinicas WHERE id_consulta = ?",
      [id]
    );

    res.json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteConsultaClinica = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsConsultaClinicaSchema.parse(req.params);
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
    const [result]: [any, FieldPacket[]] = await pool.query(
      "UPDATE consultas_clinicas SET estado = 0 WHERE id_consulta = ?",
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe la consulta clínica" });
    }

    res.status(200).json({ msg: "Consulta clínica eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
