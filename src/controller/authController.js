import newuser from "../model/UserModel.js"
import jwt from 'jsonwebtoken'

const SignupController = async (req, res) => {
    try {
        const { email, password, name } = req.body
    if (!email || !password || !name) {
        return res.status(400).json({
            status: false,
            message: "Please fill the required fields"
        })
    }
    const myUser = await newuser.create(req.body)
    return res.status(200).json({
            status: true,
            message: "User created successfully",
            data : myUser
        })
    } catch (error) {
         res.status(400).json({
            status: false,
            message: error.message
        })
        
    }
}

const LoginController = async (req, res) => {
    try {
        const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Please fill the required fields"
        })
    }
    const myUser = await newuser.findOne({
        email
    })

    if(!myUser){
        return res.status(400).json({
            status: false,
            message: "Invalid credentials"
        })

    }
    if (password == myUser.password) {
        const token = jwt.sign({
            id: myUser._id,
            email: myUser.email
        }, process.env.JWT_SECRET_KEY);

        return res.status(200).json({
            status: true,
            message: "User Login successfully",
            token: token
        })
    } else {
        return res.status(400).json({
            status: false,
            message: "Invalid credentials"
        })
    }

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })
        
    }
}


export {LoginController , SignupController}