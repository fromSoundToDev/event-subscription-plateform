import Event from '../models/event.model';
import { find, findByIdAndUpdate, findByIdAndDelete, findById } from 'mongoose'
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import Notification from '../models/notification.model';

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



// Simuler le paiement et générer un QR Code
exports.registerForEventWithPayment = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'événement
    const { paymentDetails } = req.body; // Simuler des détails de paiement
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'event not found' });
    }

    if (event.attendeesCount >= event.maxAttendees) {
      return res.status(400).json({ message: 'any place avalaible' });
    }

    // Simuler un paiement réussi
    const paymentSuccessful = paymentDetails && paymentDetails.amount > 0; // Exemple
    if (!paymentSuccessful) {
      return res.status(400).json({ message: 'payment failed' });
    }

    // Générer un QR Code avec les informations de l'inscription
    const qrData = {
      eventId: event._id,
      userId: req.user.id,
      paymentDetails,
    };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Mettre à jour les places disponibles
    event.attendeesCount += 1;
    await event.save();

    // Envoyer un e-mail de confirmation avec le QR Code
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Vous pouvez remplacer par un autre service SMTP
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: 'subscription confirmation',
      html: `
        <h1>Inscription Confirmée</h1>
        <p>Thanks for subscribing to the event : <strong>${event.title}</strong>.</p>
        <p>Here is your QR Code :</p>
        <img src="${qrCode}" alt="QR Code">
      `,
    };

    await transporter.sendMail(mailOptions);

    // Ajouter une notification à l'utilisateur qui a créé l'événement
    const notification = new Notification({
      userId: event.createdBy,
      message: `You get one subscrition for  : ${event.title}`,
    });
    await notification.save();

    res.status(200).json({
      message: 'subscription succeded ',
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ message: 'payment error during subscription', error });
  }
};
