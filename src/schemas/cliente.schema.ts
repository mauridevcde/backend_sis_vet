import { z } from "zod";

export type cliente = {
  nombre_apellido: string;
  ruc: string;
  ci: string;
  nro_tel: string;
  direccion: string;
  correo: string;
  id_mascota: number;
  estado: number;
};

export const postclienteSchema = z.object({
  nombre_apellido: z
    .string()
    .min(1, { message: "Nombre y apellido es requerido" })
    .max(30, { message: "Nombre y apellido no puede exceder 30 caracteres" }),
  ruc: z
    .string()
    .min(1, { message: "RUC es requerido" })
    .max(11, { message: "RUC no puede exceder 11 caracteres" })
    .nonempty({ message: "RUC no puede estar vacío" }),
  ci: z
    .string()
    .min(1, { message: "CI es requerido" })
    .max(11, { message: "CI no puede exceder 11 caracteres" })
    .nonempty({ message: "CI no puede estar vacío" }),
  nro_tel: z
    .string()
    .min(1, { message: "Número de teléfono es requerido" })
    .max(15, { message: "Número de teléfono no puede exceder 15 caracteres" })
    .nonempty({ message: "Número de teléfono no puede estar vacío" }),
  direccion: z
    .string()
    .min(1, { message: "Dirección es requerida" })
    .max(20, { message: "Dirección no puede exceder 20 caracteres" })
    .nonempty({ message: "Dirección no puede estar vacío" }),
  correo: z
    .string()
    .email({ message: "Correo electrónico inválido" })
    .nonempty({ message: "Correo electrónico es requerido" }),
  id_mascota: z
    .number()
    .int()
    .min(1, { message: "ID de mascota es requerido" })
    .max(100000, { message: "ID de mascota no puede exceder 100" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});

export const putclienteSchema = z.object({
  nombre_apellido: z
    .string()
    .min(1, { message: "Nombre y apellido es requerido" })
    .max(30, { message: "Nombre y apellido no puede exceder 30 caracteres" }),
  ruc: z
    .string()
    .min(1, { message: "RUC es requerido" })
    .max(11, { message: "RUC no puede exceder 11 caracteres" })
    .nonempty({ message: "RUC no puede estar vacío" }),
  ci: z
    .string()
    .min(1, { message: "CI es requerido" })
    .max(11, { message: "CI no puede exceder 11 caracteres" })
    .nonempty({ message: "CI no puede estar vacío" }),
  nro_tel: z
    .string()
    .min(1, { message: "Número de teléfono es requerido" })
    .max(15, { message: "Número de teléfono no puede exceder 15 caracteres" })
    .nonempty({ message: "Número de teléfono no puede estar vacío" }),
  direccion: z
    .string()
    .min(1, { message: "Dirección es requerida" })
    .max(20, { message: "Dirección no puede exceder 20 caracteres" })
    .nonempty({ message: "Dirección no puede estar vacío" }),
  correo: z
    .string()
    .email({ message: "Correo electrónico inválido" })
    .nonempty({ message: "Correo electrónico es requerido" }),
  id_mascota: z
    .number()
    .int()
    .min(1, { message: "ID de mascota es requerido" })
    .max(100000, { message: "ID de mascota no puede exceder 100" }),
  estado: z
    .number()
    .int()
    .min(0, { message: "Estado es requerido" })
    .max(1, { message: "Estado no puede ser mayor a 1" }),
});

export const getByIdclienteSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID es requerido" })
    .max(10, { message: "ID no puede exceder 10 caracteres" }),
});

export const deleteByIdclienteSchema = z.object({
  id: z
    .string()
    .min(1, { message: "ID es requerido" })
    .max(10, { message: "ID no puede exceder 10 caracteres" }),
});
