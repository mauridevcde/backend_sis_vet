import { Router } from "express";
import {
  getVeterinarios,
  getVeterinariosById,
  postVeterinarios,
  putVeterinarios,
  deleteVeterinarios,
} from "../controllers/veterinarios.controller";

const veterinarios = Router();

veterinarios.get("/veterinarios", getVeterinarios);

veterinarios.get("/veterinarios/:id", getVeterinariosById);

veterinarios.post("/veterinarios", postVeterinarios);

veterinarios.put("/editarVeterinarios/:id", putVeterinarios);

veterinarios.put("/deleteVeterinarios/:id", deleteVeterinarios);

export default veterinarios;