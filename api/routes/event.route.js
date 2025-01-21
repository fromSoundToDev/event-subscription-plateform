
import express from 'express';
import eventController from '../controllers/event.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

// Routes publiques
router.get('/', eventController.getEvents);

// Routes protégées
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);
router.post('/:id/register', authMiddleware, eventController.registerForEvent);

export default eventRoute;