import { Router } from "express";
import {
  getRegistrosClinicos,
  getRegistroClinicoById,
  postRegistroClinico,
  putRegistroClinico,
  deleteRegistroClinico,
} from "../controllers/registroClinicos.controller";
 
const registrosClinicos = Router();

// Obtener todos los registros clínicos activos
registrosClinicos.get("/registrosClinicos", getRegistrosClinicos);

// Obtener un registro clínico específico por ID
registrosClinicos.get("/registrosClinicos/:id", getRegistroClinicoById);

// Crear un nuevo registro clínico
registrosClinicos.post("/registrosClinicos", postRegistroClinico);

// Actualizar un registro clínico existente
registrosClinicos.put("/editarRegistroClinico/:id", putRegistroClinico);

// Marcar un registro clínico como eliminado (soft delete)
registrosClinicos.put("/deleteRegistroClinico/:id", deleteRegistroClinico);

export default registrosClinicos;
