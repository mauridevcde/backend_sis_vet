import { pool } from "../db";

import { Usuario } from "../types/usuario.types";

import * as dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const verifyUserExists = async (usuario: string) => {
  const [rows]: any = await pool.query(
    "SELECT * FROM db_usuarios where Usuario = ?",
    [usuario]
  );

  if ((await rows[0]) == undefined) {
    return false;
  } else {
    return true;
  }
};

export const postregister = async (req: Request, res: Response) => {
  // Manejamos los datos que vienen desde el body.
  const { id_usuario, nombre_apellido, id_rol, usuario, password } =
    req.body as Usuario;

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
      parseInt(process.env.saltRounds)
    );

    const [rows] = await pool.query(
      "INSERT INTO db_usuarios ( Nombre, Usuario, password,FechaNac,Sexo,Activo,VenderHasta,StockInsuficiente ) VALUES (?,?,?,?,?,?,?,?)",
      [
        Nombre,
        Usuario,
        hashedPassword,
        FechaNac,
        Sexo,
        Activo,
        VenderHasta,
        StockInsuficiente,
      ]
    );
    res.json({ msg: "Usuario Registrado con exito" });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).json({ msg: "Error en el servidor" });
  }
};

export const login = async (req, res) => {
  const { Usuario, password } = req.body;

  //si existe el usuario.
  const [user] = await pool.query(
    "SELECT * FROM db_usuarios where Usuario = ?",
    [Usuario]
  );

  if (user[0] == undefined) return res.json({ msg: "usuario no existe" });

  //consulta sobre el usuario y la contraseña
  const hashedpassword = user[0].password;
  const decryptPass = await bcrypt.compare(password, hashedpassword);

  if (!decryptPass) return res.json({ msg: "usuario o contraseña incorrecta" });

  const { id, Nombre, id_permiso } = user[0];

  const token = jwt.sign(
    {
      id,
      id_permiso,
    },
    process.env.SecretJWT,
    {
      expiresIn: "2h",
    }
  );

  res
    .cookie("access_token", token, { maxAge: 1000 * 60 * 60 })
    .send({ id, Nombre, id_permiso, token: token });
};
