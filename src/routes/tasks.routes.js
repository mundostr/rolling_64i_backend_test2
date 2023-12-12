import { Router } from 'express'
// Importamos la definición del modelo, TODAS las consultas se hacen a través de éste.
import taskModel from '../models/task.model.js'

const router = Router()

/**
 * Endpoint para consultas por estado.
 * Utilizamos un parámetro status (req.params.status) para indicar si queremos
 * todas, pendientes o terminadas (all, pending, finished).
 * Recordar que los dos puntos (:) indican que el texto siguiente es un parámetro en
 * lugar de un literal.
 */
router.get('/status/:status', async (req, res) => {
    try {
        switch (req.params.status) {
            case 'all':
                res.status(200).send({ status: 'OK', data: await taskModel.find() })
                break

            case 'pending':
            case 'finished':
                res.status(200).send({ status: 'OK', data: await taskModel.find({ status: req.params.status }) })
                break
            
            default:
                res.status(400).send({ status: 'OK', data: 'El parámetro de estado no es válido. Solo se acepta all / pending / finished' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

/**
 * Endpoint para consultas por rango de fecha (day, week, month)
 */
router.get('/range/:range', async (req, res) => {
    try {
        const current = new Date()
        const dateStart = new Date(current)
        const dateEnd = new Date(current)
        
        dateStart.setHours(0, 0, 0, 0)
        switch (req.params.range) {
            case 'day':
                dateEnd.setHours(23, 59, 59, 999)
                break

            case 'week':
                dateEnd.setDate(current.getDate() + (6 - current.getDay()))
                break

            case 'month':
                dateEnd.setDate(current.getDate() + (31 - current.getDay()))
                break

            default:
                res.status(400).send({ status: 'OK', data: 'El parámetro de rango no es válido. Solo se acepta day / week / month' })
        }
        
        const tasks = await taskModel.aggregate([
            { $match: { target_date: { $gte: dateStart, $lte: dateEnd }}},
            { $sort: { target_date: 1 }}
        ])

        res.status(200).send({ status: 'OK', data: tasks })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

/**
 * Endpoint para carga de nueva tarea
 */
router.post('/', async (req, res) => {
    try {
        const newTask = {
            description: req.body.description,
            target_date: req.body.target_date,
            status: req.body.status
        }
    
        const process = await taskModel.create(newTask)
        res.status(200).send({ status: 'OK', data: process })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

/**
 * Endpoint para cambio de estado de una tarea
 * Utilizamos el verbo patch en lugar de put, porque solo estamos cambiando status
 */
router.patch('/status/:tid/:status', async (req, res) => {
    try {
        if (req.params.tid && req.params.status) {
            const process = await taskModel.findOneAndUpdate(
                { _id: req.params.tid },
                { status: req.params.status },
                // Importante! runValidators true para que status respete solo las opciones
                // del enum cargado en la definición del modelo
                { new: true, runValidators: true }
            )

            res.status(200).send({ status: 'OK', data: process })
        } else {
            res.status(400).send({ status: 'ERR', data: 'Se requiere id de tarea y nuevo estado' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

/**
 * Endpoint para cambio de prioridad, similar al caso anterior
 */
router.patch('/priority/:tid/:priority', async (req, res) => {
    try {
        if (req.params.tid && req.params.priority) {
            const process = await taskModel.findOneAndUpdate(
                { _id: req.params.tid },
                { priority: req.params.priority },
                // Importante! runValidators true para que priority respete solo las opciones
                // del enum cargado en la definición del modelo
                { new: true, runValidators: true }
            )

            res.status(200).send({ status: 'OK', data: process })
        } else {
            res.status(400).send({ status: 'ERR', data: 'Se requiere id de tarea y nueva prioridad' })
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

/**
 * Endpoint para borrado de tarea
 */
router.delete('/:tid', async (req, res) => {
    try {
        const process = await taskModel.findOneAndDelete({ _id: req.params.tid })
        res.status(200).send({ status: 'OK', data: process === null ? 'No se encontró el ID': 'ID Borrado' })
    } catch (err) {
        res.status(500).send({ status: 'ERR', data: err.message })
    }
})

export default router