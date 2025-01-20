import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },
  date: {
    type: Date,
    required: [true, 'date is required'],
    validate: {
      validator: (value) => value > Date.now(),
      message: 'can\'t use passed date',
    },
  },
  location: {
    type: String,
    required: [true, 'event location required'],
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: [0, 'only positives numbers are allowed'],
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    default: 0,
    min: [0, 'price cant be negative'],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.pre('save', function (next) {
  if (this.seatsAvailable < 0) {
    next(new Error('avalaible places cant be negative'));
  } else {
    next();
  }
});

export default model('Event', eventSchema);
