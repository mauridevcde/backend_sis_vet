import { Router } from "express";
import {
  getVacunas,
  getVacunaById,
  postVacuna,
  putVacuna,
  deleteVacuna,
} from "../controllers/vacunas.controller";

const vacunas = Router();

// Obtener todas las vacunas activas
vacunas.get("/vacunas", getVacunas);

// Obtener una vacuna específica por ID
vacunas.get("/vacunas/:id", getVacunaById);

// Crear una nueva vacuna
vacunas.post("/vacunas", postVacuna);

// Actualizar parcialmente una vacuna existente
vacunas.put("/editarVacunas/:id", putVacuna);

// Marcar una vacuna como eliminada (soft delete)
vacunas.put("/deleteVacunas/:id", deleteVacuna);

export default vacunas;
