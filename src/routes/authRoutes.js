import { Router } from "express";
import { LoginController, SignupController } from "../controller/authController.js";

const authroute  =  Router()

authroute.post('/login',LoginController)
authroute.post('/signup',SignupController)


export default authroute