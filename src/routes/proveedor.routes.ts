import { Router } from "express";
import { deleteProveedor, getProveedorById, getProveedores, postProveedor, putProveedor } from "../controllers/proveedores.controler";


const proveedores = Router();

proveedores.get("/proveedores", getProveedores);
proveedores.get("/proveedores/:id", getProveedorById);
proveedores.post("/proveedores", postProveedor);
proveedores.put("/editarProveedores/:id", putProveedor);
proveedores.put("/deleteProveedor/:id", deleteProveedor);

export default proveedores;
