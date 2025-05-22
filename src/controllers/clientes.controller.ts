import { Request, Response } from "express";
import { pool } from "../db";
import { cliente } from "../types/cliente.types";
import { FieldPacket } from "mysql2";

export const getClientes = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes where estado = 1");
    console.log(rows);
    res.json(rows); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const getClientesById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = ? and estado = 1",
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

export const postClientes = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    nombre_apellido,
    ruc,
    ci,
    nro_tel,
    direccion,
    correo,
    id_mascota,
    estado,
  } = req.body as cliente;
  try {
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "INSERT INTO clientes (nombre_apellido, ruc, ci, nro_tel, direccion, correo, id_mascota, estado) VALUES (?, ?,?, ?,?, ?,?,?)",
      [nombre_apellido, ruc, ci, nro_tel, direccion, correo, id_mascota, estado]
    );
    res.send({
      nombre_apellido,
      ruc,
      ci,
      nro_tel,
      direccion,
      correo,
      id_mascota,
      estado,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const putClientes = async (
  req: Request,
  res: Response
): Promise<any> => {
  //consultar si el fontend va a necesitar por el params o por el body.
  const { id } = req.params;
  const {
    nombre_apellido,
    ruc,
    ci,
    nro_tel,
    direccion,
    correo,
    id_mascota,
    estado,
  } = req.body as cliente;
  console.log(id);
  try {
    const [result]: any = await pool.query(
      "UPDATE clientes SET nombre_apellido = IFNULL(?, nombre_apellido) , ruc = IFNULL(?, ruc), ci = IFNULL(?, ci), nro_tel = IFNULL(?, nro_tel), direccion = IFNULL(?, direccion), correo = IFNULL(?, correo), id_mascota = IFNULL(?, id_mascota), estado = IFNULL(?, estado) WHERE id_cliente = ?",
      [
        nombre_apellido,
        ruc,
        ci,
        nro_tel,
        direccion,
        correo,
        id_mascota,
        estado,
        id,
      ]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el cliente" });
    }
    // ahora si existe el cliente y se actualizo correctamente llamamos a la base de datos para que nos devuelva el cliente actualizado
    const [rows]: [any[], FieldPacket[]] = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );

    res.json(rows[0]); //devuelve un json
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const deleteCLientes = async (
  req: Request,
  res: Response
): Promise<any> => {
  //consultar si el fontend va a necesitar por el params o por el body.
  const { id } = req.params;

  console.log(id);

  try {
    const [result]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "UPDATE clientes SET Estado = 0 WHERE id_cliente = ?",
      [id]
    );

    if (result.affectedRows <= 0) {
      return res.status(404).json({ msg: "No existe el cliente" });
    }
    // ahora si existe el cliente y se actualizo correctamente llamamos a la base de datos para que nos devuelva el cliente actualizado
    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id]
    );
    res.status(200).json({ msg: "Cliente Eliminado con Exito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};
