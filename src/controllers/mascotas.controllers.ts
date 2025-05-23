import { Request, Response } from "express";
import { pool } from "../db";
import { FieldPacket } from "mysql2";
import { ZodError } from "zod";
import {
  idParamsmascotaSchema,
  mascota,
  postmascotaSchema,
  putmascotaSchema,
} from "../schemas/mascotas.schema";

export const getMascotas = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM mascotas where estado = 1");
    console.log(rows);
    res.json(rows); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const getMascotasById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    idParamsmascotaSchema.parse(req.params);
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
      "SELECT * FROM mascotas WHERE id_mascota = ? and estado = 1",
      [id]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ msg: "No existe el cliente" });
    }
    res.json(rows[0]); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const postMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    postmascotaSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { nombre, id_categoria_animal, raza, sexo, estado } =
    req.body as mascota;
  try {
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "INSERT INTO mascotas (nombre,id_categoria_animal,raza,sexo,estado) VALUES (?,?,?,?,?)",
      [nombre, id_categoria_animal, raza, sexo, estado]
    );
    res.send({
      nombre,
      id_categoria_animal,
      raza,
      sexo,
      estado,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const putMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    putmascotaSchema.parse(req.body);
    idParamsmascotaSchema.parse(req.params);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        msg: "Error en la validacion de los datos",
        errors: error.errors,
      });
    }
  }

  const { id } = req.params;
  const { nombre, id_categoria_animal, raza, sexo, estado } =
    req.body as mascota;
  console.log(id);
  try {
    const [result]: any = await pool.query(
      "UPDATE mascotas SET nombre = IFNULL(?, nombre), id_categoria_animal = IFNULL(?, id_categoria_animal), raza = IFNULL(?, raza), sexo = IFNULL(?, sexo), estado = IFNULL(?, estado) WHERE id_mascota = ?",
      [nombre, id_categoria_animal, raza, sexo, estado, id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el cliente" });
    }
    // ahora si existe el cliente y se actualizo correctamente llamamos a la base de datos para que nos devuelva el cliente actualizado
    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM mascotas WHERE id_mascota = ?",
      [id]
    );

    res.json(rows[0]); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteMascotas = async (
  req: Request,
  res: Response
): Promise<any> => {
  //consultar si el fontend va a necesitar por el params o por el body.
  try {
    idParamsmascotaSchema.parse(req.params);
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
      "UPDATE mascotas SET estado = 0 WHERE id_mascota = ?",
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el cliente" });
    }
    // ahora si existe el cliente y se actualizo correctamente llamamos a la base de datos para que nos devuelva el cliente actualizado
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "SELECT * FROM mascotas WHERE id_mascota = ?",
      [id]
    );
    res.status(200).json({ msg: "Cliente Eliminado con Exito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};
