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