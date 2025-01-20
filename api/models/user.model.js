const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: 'Your email is not valid',
    },
  },
  password: {
    type: String,
    required: [true, 'wrong credencial'],
    minlength: [6, 'minimum 6 digits please'],
  },
  role: {
    type: String,
    enum: ['user', 'organizer'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing of password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// delrtion of the password from the JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
