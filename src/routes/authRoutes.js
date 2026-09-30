import { Router } from "express";
import { LoginController, SignupController, UpdateController, DeleteController, GetMe } from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const authroute = Router()


authroute.post('/login', LoginController)
authroute.post('/signup', SignupController)
authroute.get('/me', authMiddleware, GetMe);
authroute.put('/update',authMiddleware, UpdateController)
authroute.delete('/delete',authMiddleware, DeleteController)


export default authroute