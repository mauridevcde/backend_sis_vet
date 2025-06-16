import { Router } from "express";
import {
  getAllComprasJoin,
  getCompraById,
  getCompras,
  getDetalleByCompraID,
  getDetallesCompra,
  postCompraCompleta,
} from "../controllers/compras.controller";

const compras = Router();

compras.get("/compras", getCompras);

compras.get("/detalleCompras", getDetallesCompra);

compras.get("/compras/:id", getCompraById);

compras.post("/compraCompleta", postCompraCompleta);

compras.get("/consultaCompraJoin", getAllComprasJoin);

//Detalle de compra by IdCompra.
compras.get("/getDetalleByCompraID/:id", getDetalleByCompraID);

export default compras;
