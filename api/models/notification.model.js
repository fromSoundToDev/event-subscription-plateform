import { Schema, model } from 'mongoose';
import { createTransport } from 'nodemailer';

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


notificationSchema.post('save', async function (doc) {
  const transporter = createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'noreply@platform.com',
    to: doc.user.email,
    subject: 'Nouvelle Notification',
    text: doc.message,
  };

  await transporter.sendMail(mailOptions);
});

export default model('Notification', notificationSchema);
