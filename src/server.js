import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authroute from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({origin:process.env.ORIGINS.split(","),credentials:true}))
app.use(cookieParser())

app.get('/',(req , res)=>{
    res.json('Server is running.....')
})

app.use('/api/v1/auth', authroute)
// app.use('/user', authroute)

app.use((err , _req , res , next)=>{
    console.log(`[Error] ${error.message}`);
    res.status(500).json({error :err.message})
})

app.use(process.env.PORT || PORT , ()=>{
    console.log(`Server is running on port no ${process.env.PORT}`);
})