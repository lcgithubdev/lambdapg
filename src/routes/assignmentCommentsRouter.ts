import { Hono } from "hono";

import auth from "../middlewares/auth";

import accessUser from  "../middlewares/accessUser";

import AssignmentCommentsController from "../controllers/AssignmentCommentsController";

const assignmentCommentsController = new AssignmentCommentsController();

const assignmentCommentsRouter = new Hono();

assignmentCommentsRouter.post('/addcomment', auth, accessUser, assignmentCommentsController.addComment);

assignmentCommentsRouter.post('/getcomment', auth, accessUser, assignmentCommentsController.getComment);

assignmentCommentsRouter.post('/getcomments', auth, accessUser, assignmentCommentsController.getComments);

assignmentCommentsRouter.get('/createtable',  assignmentCommentsController.createTable);

//assignmentCommentsRouter.get('/droptable', auth, accessUser, assignmentCommentsController.dropTable);

//assignmentCommentsRouter.post('/getkey', auth, accessUser, assignmentCommentsController.getKey);

//assignmentCommentsRouter.get('/test', assignmentCommentsController.test);

export default assignmentCommentsRouter