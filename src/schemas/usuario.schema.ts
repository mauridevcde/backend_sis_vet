import { z } from "zod";

export type Usuario = {
  id_usuario: number;
  nombre_apellido: string;
  id_rol: number;
  usuario: string;
  password: string;
  estado: number;
};

export type UsuarioRegister = {
  nombre_apellido: string;
  id_rol: number;
  usuario: string;
  password: string;
  estado: number;
};

export type UsuarioLogin = {
  usuario: string;
  password: string;
};

export const usuarioSchema = z.object({
  nombre_apellido: z.string().min(1).max(60).nonempty("Campo requerido"),
  id_rol: z.number().int(),
  usuario: z.string().min(1).max(20).nonempty("Campo requerido"),
  password: z.string().min(1).max(120).nonempty("Campo requerido"),
  estado: z.number().int(),
});

export const usuarioLoginSchema = z.object({
  usuario: z.string().min(1).max(20).nonempty("Campo requerido"),
  password: z.string().min(1).max(120).nonempty("Campo requerido"),
});