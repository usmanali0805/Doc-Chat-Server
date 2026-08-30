import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authroute from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import chatRoutes from './routes/chatRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
dotenv.config()

const app = express()

// middleware
app.use(express.json())
app.use(cors({origin:process.env.ORIGINS.split(","),credentials:true}))
app.use(cookieParser())

// Routes
app.use('/api/v1/auth', authroute)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/chat', chatRoutes)


// Health api
app.use((err , _req , res , next)=>{
    console.log(`[Error] ${error.message}`);
    res.status(500).json({error :err.message})
})

app.use(process.env.PORT || PORT , ()=>{
    console.log(`Server is running on port no ${process.env.PORT}`);
})