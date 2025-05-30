import { Router } from "express";
import { login, postregister } from "../controllers/auth.controllers";

const auth = Router();

//registro de usuario
auth.post("/register", postregister);

auth.post("/login", login);

export default auth;
