import { pool } from "../db";

import { Usuario, UsuarioLogin, UsuarioRegister } from "../types/usuario.types";

import * as dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { FieldPacket, QueryResult } from "mysql2";

const verifyUserExists = async (usuario: string) => {
  const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
    "SELECT * FROM usuarios where Usuario = ?",
    [usuario]
  );

  if ((await rows[0]) == undefined) {
    return false;
  } else {
    return true;
  }
};

export const postregister = async ({ body }: Request, res: Response) => {
  // Manejamos los datos que vienen desde el body.
  const { nombre_apellido, id_rol, usuario, password } =
    body as UsuarioRegister;

  const verify = await verifyUserExists(usuario);

  try {
    //verificar si existe o no el usuario.
    if (verify == true) {
      res.json({ msg: "El usuario ya se encuentra registrado" });
      return;
    }
    //procede a crear el usuario.

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRounds as string)
    );

    const [rows]: [QueryResult: any, FieldPacket[]] = await pool.query(
      "INSERT INTO usuarios ( nombre_apellido, id_rol, usuario, password, estado) VALUES (?,?,?,?,?)",
      [nombre_apellido, id_rol, usuario, hashedPassword, 1]
    );
    res.json({ msg: "Usuario Registrado con exito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { usuario, password } = req.body as UsuarioLogin;

  //si existe el usuario.
  const [user]: [QueryResult: any, FieldPacket[]] = await pool.query(
    "SELECT * FROM usuarios where Usuario = ?",
    [usuario]
  );

  if (user[0] == undefined) return res.json({ msg: "usuario no existe" });

  //consulta sobre el usuario y la contraseña
  const hashedpassword = user[0].password;
  const decryptPass = await bcrypt.compare(password, hashedpassword);

  if (!decryptPass) return res.json({ msg: "usuario o contraseña incorrecta" });

  const { id_usuario, nombre_apellido, id_rol } = user[0] as Usuario;

  const token = jwt.sign(
    {
      id_usuario,
      id_rol,
    },
    process.env.SecretJWT as string,
    {
      expiresIn: "2h",
    }
  );

  res
    .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
    .send({ id_usuario, nombre_apellido, id_rol, token: token });
};
