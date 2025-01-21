
import express from 'express';
import {createEvent,getEvents,updateEvent,deleteEvent,registerForEventWithPayment} from '../controllers/event.controller.js';
import {protect} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes publiques
router.get('/', getEvents);

// Routes protégées
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register-with-payment', protect, registerForEventWithPayment);
export default eventRoute;