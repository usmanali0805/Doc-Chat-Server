import mongoose from "mongoose";

const user = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String , 
        required : true, 
        unique : true
    },
    password : {
        type :String,
        required :true
    },
    plan : {
        type : String ,
        enum : ["free" ,  "paid" ],
        default :"free",
        required : true 
    },
},{
    timestamps : true
})

const User = mongoose.model('User', user)
export default User ;