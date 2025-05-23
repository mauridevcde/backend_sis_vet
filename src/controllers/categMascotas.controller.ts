import { Request, Response } from "express";
import { pool } from "../db";

import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  catmascota,
  idCatParamsmascotaSchema,
  postcatmascotaSchema,
  putcatmascotaSchema,
} from "../schemas/categMascotas.schema";

export const getCategMascotas = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categorias_mascotas where estado = 1"
    );
    console.log(rows);
    res.json(rows); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const getCategMascotasById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idCatParamsmascotaSchema.parse(req.params);
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
      "SELECT * FROM categorias_mascotas WHERE id_categoria_mascota = ? and estado = 1",
      [id]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ msg: "No existe el categorias_mascotas" });
    }
    res.json(rows[0]); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const postCategMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postcatmascotaSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { descripcion, estado } = req.body as catmascota;
  try {
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "INSERT INTO categorias_mascotas (descripcion, estado) VALUES (?, ?)",
      [descripcion, estado]
    );
    res.send({
      descripcion,
      estado,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const putCategMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    putcatmascotaSchema.parse(req.body);
    idCatParamsmascotaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const { descripcion } = req.body as catmascota;
  console.log(id);
  try {
    const [result]: any = await pool.query(
      "UPDATE categorias_mascotas SET descripcion = IFNULL(?, descripcion) WHERE id_categoria_mascota = ?",
      [descripcion, id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el categorias_mascotas" });
    }
    // ahora si existe el categorias_mascotas y se actualizo correctamente llamamos a la base de datos para que nos devuelva el categorias_mascotas actualizado
    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM categorias_mascotas WHERE id_categoria_mascota = ?",
      [id]
    );

    res.json(rows[0]); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteCategMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  //consultar si el fontend va a necesitar por el params o por el body.
  try {
    idCatParamsmascotaSchema.parse(req.params);
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
    const [result]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "UPDATE categorias_mascotas SET Estado = 0 WHERE id_categoria_mascota = ?",
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el categorias_mascotas" });
    }
    // ahora si existe el categorias_mascotas y se actualizo correctamente llamamos a la base de datos para que nos devuelva el categorias_mascotas actualizado
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "SELECT * FROM categorias_mascotas WHERE id_categoria_mascota = ?",
      [id]
    );
    res.status(200).json({ msg: "categorias_mascotas Eliminado con Exito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};
