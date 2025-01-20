import Event from '../models/event.model';
import { find, findByIdAndUpdate, findByIdAndDelete, findById } from 'mongoose'

// Create an event
export async function createEvent(req, res) {
  try {
    const { title, description, date, location, maxAttendees } = req.body;
    const event = new Event({
      title,
      description,
      date,
      location,
      maxAttendees,
      createdBy: req.user.id, 
    });
    await event.save();
    res.status(201).json({ message: 'event created sucessfully', event });
  } catch (error) {
    res.status(400).json({ message: 'error during event creation', error });
  }
}

// Récupérer tous les événements
export async function getEvents(req, res) {
  try {
    const events = await find().populate('createdBy', 'name email');
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Erreur when getting the event ', error });
  }
}

// Mettre à jour un événement
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updatedEvent = await findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'cant find the event' });
    }
    res.status(200).json({ message: 'event updated successfully', updatedEvent });
  } catch (error) {
    res.status(400).json({ message: 'Error when updating the event', error });
  }
}

// Supprimer un événement
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const deletedEvent = await findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'cant find event' });
    }
    res.status(200).json({ message: 'event deleted successfully', deletedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Error when deleting the event', error });
  }
}

// Inscrire un utilisateur à un événement
export async function registerForEvent(req, res) {
  try {
    const { id } = req.params; // ID de l'événement
    const event = await findById(id);

    if (!event) {
      return res.status(404).json({ message: 'cant find event' });
    }

    if (event.attendeesCount >= event.maxAttendees) {
      return res.status(400).json({ message: 'no more seat avalaible for this event' });
    }

    event.attendeesCount += 1;
    await event.save();

    res.status(200).json({ message: 'subsciption succeded', event });
  } catch (error) {
    res.status(500).json({ message: 'Error during subscription' });
  }
}