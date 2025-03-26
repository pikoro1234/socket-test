import express from 'express'

const router = express.Router()

router.get('/', createProjectData)

// router.get('/:id', getProjectData)

export default router