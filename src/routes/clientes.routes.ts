import { Router } from "express";
import {
  getClientes,
  getClientesById,
  postClientes,
  putClientes,
  deleteCLientes,
} from "../controllers/clientes.controller";
const clientes = Router();

clientes.get("/clientes", getClientes);

clientes.get("/clientes/:id", getClientesById);

clientes.post("/clientes", postClientes);

clientes.put("/editarclientes/:id", putClientes);

clientes.put("/deleteClientes/:id", deleteCLientes);

export default clientes;
