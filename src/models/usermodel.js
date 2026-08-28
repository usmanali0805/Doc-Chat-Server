import mongoose from "mongoose";

const user = new mongoose.Schema({
    name:{
        type : String,
        require : true,
    },
    email:{
        type : String , 
        require : true, 
        unique : true
    },
    password : {
        type :String,
        require :true
    },
    plane : {
        value : "free" || "Paid"
    },
    CreatedAt : new Date()
})

const User = mongoose.model('User', user)
export default User ;