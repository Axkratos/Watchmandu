// models/watch.js
const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    
  },
  photo: {
    type: String, // Assuming you store the photo URL as a string
    default: 'default_photo_url.jpg', // You can set a default photo if needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;