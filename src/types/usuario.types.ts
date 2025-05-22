export type Usuario = {
  id_usuario: number;
  nombre_apellido: string;
  id_rol: number;
  usuario: string;
  password: string;
};

export type UsuarioRegister = {
  nombre_apellido: string;
  id_rol: number;
  usuario: string;
  password: string;
};

export type UsuarioLogin = {
  usuario: string;
  password: string;
};