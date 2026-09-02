import { Router } from "express";
import { LoginController, SignupController , UpdateController , DeleteController } from "../controller/authController.js";

const authroute  =  Router()

authroute.post('/login',LoginController)
authroute.post('/signup',SignupController)
authroute.put('/update',UpdateController)
authroute.delete('/delete',DeleteController)


export default authroute