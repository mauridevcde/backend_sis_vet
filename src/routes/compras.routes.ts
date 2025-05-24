import { Router } from "express";
import { getCompraById, getCompras, getDetallesCompra, postCompraCompleta } from "../controllers/compras.controller";


const compras = Router();

compras.get("/compras", getCompras);

compras.get("/detalleCompras", getDetallesCompra);

compras.get("/compras/:id", getCompraById);

compras.post("/compraCompleta", postCompraCompleta);

export default compras;
