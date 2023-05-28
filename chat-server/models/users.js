const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
    },

    password: {
        type: String,
        required: true,
    },

    avaterImage: {
        type: String,
        default: "",
    },

    isAvatar: {
      type: Boolean,
      default: false
    }

});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

module.exports = mongoose.model("Users", userSchema);