import { Router } from "express";
import { LoginController, SignupController, UpdateController, DeleteController } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authroute = Router()

authroute.use(authMiddleware)

authroute.post('/login', LoginController)
authroute.post('/signup', SignupController)
authroute.put('/update', UpdateController)
authroute.delete('/delete', DeleteController)


export default authroute