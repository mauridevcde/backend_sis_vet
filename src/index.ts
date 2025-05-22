import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import auth from "./routes/auth.routes";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, 
  allowedHeaders: ["Content-Type", "Authorization"], // Permitir solo estos encabezados
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/auth", auth);