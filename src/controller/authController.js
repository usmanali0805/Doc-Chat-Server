import newuser from "../models/usermodel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from "../models/usermodel.js"

const SignupController = async (req, res) => {
    try {
        const { email, password, name } = req.body
        if (!email || !password || !name) {
            return res.status(400).json({
                status: false,
                message: "Please fill the required fields"
            })
        }

        bcrypt.hash(password, 12, async function (err, hash) {
            try {
                req.body.password = hash
                const myUser = await newuser.create(req.body)
                return res.status(200).json({
                    status: true,
                    message: "User created successfully",
                    data: myUser
                })

            } catch (error) {
                return res.status(200).json({
                    status: false,
                    message: error.message,
                })

            }
        });
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
        }).select("+password")

        if (!myUser) {
            return res.status(400).json({
                status: false,
                message: "Invalid credentials"
            })

        }
        bcrypt.compare(password, myUser.password, function (err, result) {
            try {
                if (result) {
                    const token = jwt.sign({
                        id: myUser._id,
                        email: myUser.email
                    }, process.env.JWT_SECRET_KEY);
                    return res.status(200).json({
                        status: true,
                        message: "User Login successfully",
                        token: token
                    });
                }
                else {
                    return res.status(400).json({
                        status: false,
                        message: "Invalid credentials"
                    })
                }
            } catch (error) {
                res.status(400).json({
                    status: false,
                    message: error.message
                })

            }
        })

    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error.message
        })

    }
}

const DeleteController = async (req, res) => {
    try {
        const { email, password } = req.body
        const authheader = req.headers.authorization
        const token = authheader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByIdAndDelete(decoded.id)
        
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "User Deleted successfully "
        })
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: error.message
        })
    }
}

const UpdateController = async (req, res) => {
   try {
        const { email, password , name } = req.body
        const authheader = req.headers.authorization
        const token = authheader.split(" ")[1];
        bcrypt.hash(password, 12,async function(err, hash) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findByIdAndUpdate(decoded.id ,{
                "name" : name,
                "email" : email,
                "password" : hash,   
            })
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                })
            }
        });
        

        return res.status(200).json({
            status: true,
            message: "User Updated successfully "
        })
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: error.message
        })
    }
}

export { LoginController, SignupController, DeleteController, UpdateController }