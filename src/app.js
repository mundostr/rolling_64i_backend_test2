import express from 'express'
import tasksRouter from './routes/tasks.routes.js'

const APP_PORT = 5050

try {
    const app = express()

    app.listen(APP_PORT, () => {
        console.log(`Backend iniciado en puerto ${APP_PORT}`)
    })

    app.use('/api/tasks', tasksRouter)
} catch(err) {
    console.log(`ERROR al inicializar backend: ${err.message}`)
}