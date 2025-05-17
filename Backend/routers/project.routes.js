import {Router} from "express"
import {body} from 'express-validator'

import * as  projectController from '../controllers/project.controller.js'
import  * as authMiddleWare from "../middlewares/auth.middleware.js"

const router=Router()

router.post('/create',
    authMiddleWare.authUser,
    body('name').isString().withMessage('Name is must needed'),
    projectController.CreateProject
)
router.get('/all',
    authMiddleWare.authUser,
    projectController.getAllProjects
)

router.put('/add-user',
    authMiddleWare.authUser,
    body('projectId').isString().withMessage('ProjectID should be in string format'),
    body('users').isArray({min:1}).withMessage('Users must be an array of strings').bail()
    .custom((users)=> users.every(user=> typeof user === 'string')).withMessage("Each User must be a string"),
    projectController.addUsers
)

router.get('/get-project/:projectId',
    authMiddleWare.authUser,
    projectController.getProjectById
)

export default router