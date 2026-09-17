import dns from 'dns'
dns.setServers(['1.1.1.1' , '8.8.8.8'])
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authroute from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import chatRoutes from './routes/chatRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import connectDB from './config/ConnectDB.js'

dotenv.config()

connectDB()

const app = express()

// middleware
app.use(express.json())
app.use(cors({origin:process.env.ORIGINS.split(","),credentials:true}))
app.use(cookieParser())

// Routes
app.use('/api/v1/auth', authroute)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/chat', chatRoutes)


// error handler
// error handler
app.use((err, req, res, next) => {
    console.error("[Error]:", err.message);
    console.error(err.stack);              // ← poora stack trace, file+line ke sath
    console.error("Path:", req.originalUrl);
    res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Server is running on port no ${process.env.PORT}`);
})