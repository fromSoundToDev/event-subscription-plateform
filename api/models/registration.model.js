import { Schema, model } from 'mongoose';
import { toDataURL } from 'qrcode';

const registrationSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  qrCode: {
    type: String, // URL or base64
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Vérifier l'inscription unique
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Génération du QR Code après inscription
registrationSchema.pre('save', async function (next) {
  if (this.isPaid && !this.qrCode) {
    const qrData = {
      eventId: this.event,
      userId: this.user,
      amountPaid: this.amountPaid,
    };
    this.qrCode = await toDataURL(JSON.stringify(qrData));
  }
  next();
});

export default model('Registration', registrationSchema);
