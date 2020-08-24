const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, 'Please add blog title'],
  },
  content: {
    type: String,
    maxlength: [3000, 'Please add less than 3000 character'],
    required: [true, 'Please add blog content'],
  },
  author: {
    type: String,
    required: [true, 'Please add your name'],
  },
  category: {
    type: String,
    enum: [
      'Tech',
      'Programming',
      'Art',
      'Film',
      'Books',
      'Music',
      'Bussiness',
      'Geography',
    ],
  },
  tags: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
