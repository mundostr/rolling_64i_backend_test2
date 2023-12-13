import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import tasksRouter from './routes/tasks.routes.js'

dotenv.config()

const APP_PORT = process.env.APP_PORT || 5000
// const MONGODB_URL_LOCAL = 'mongodb://127.0.0.1:27017/rolling64i'
const MONGODB_URL = process.env.MONGODB_URL

try {
    // Agregamos el connect de Mongoose para enlazar a la base de datos
    // Importante!, no olvidar await
    await mongoose.connect(MONGODB_URL)

    const app = express()

    app.listen(APP_PORT, () => {
        console.log(`Backend iniciado en puerto ${APP_PORT}, conectado a bbdd`)
    })

    app.use(cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204
    }))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api/tasks', tasksRouter)
} catch(err) {
    console.log(`ERROR al inicializar backend: ${err.message}`)
}