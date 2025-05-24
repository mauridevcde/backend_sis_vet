import { Router } from "express";
import {
  getProductos,
  getProductoById,
  postProducto,
  putProducto,
  deleteProducto,
} from "../controllers/productos.controller";

const productos = Router();

// Obtener todos los productos
productos.get("/productos", getProductos);

// Obtener un producto por ID
productos.get("/productos/:id", getProductoById);

// Crear un nuevo producto
productos.post("/productos", postProducto);

// Actualizar un producto existente
productos.put("/editarProductos/:id", putProducto);

// Eliminar un producto
productos.put("/eliminarProductos/:id", deleteProducto);

export default productos;
