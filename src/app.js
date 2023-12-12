import express from 'express'
import mongoose from 'mongoose'
import tasksRouter from './routes/tasks.routes.js'

const APP_PORT = 5050
// const MONGODB_URL_LOCAL = 'mongodb://127.0.0.1:27017/rolling64i'
const MONGODB_URL = 'mongodb+srv://rolling64i:rolling2023@cluster0.4qaobt3.mongodb.net/rolling64i'

try {
    // Agregamos el connect de Mongoose para enlazar a la base de datos
    // Importante!, no olvidar await
    await mongoose.connect(MONGODB_URL)

    const app = express()

    app.listen(APP_PORT, () => {
        console.log(`Backend iniciado en puerto ${APP_PORT}, conectado a bbdd`)
    })

    app.use('/api/tasks', tasksRouter)
} catch(err) {
    console.log(`ERROR al inicializar backend: ${err.message}`)
}