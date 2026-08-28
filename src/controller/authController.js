function LoginController (req, res){
    res.status(200).json({
        status: true, 
        message : "User login successfully"
    })
}

function SignupController (req, res){
    res.status(200).json({
        status: true, 
        message : "User Signup successfully"
    })
}

export {LoginController , SignupController}