const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const {
  getBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  blogPhotoUpload,
} = require('../controllers/blog');

router
  .route('/')
  .get(getBlogs)
  .post(protect, authorize('admin', 'publisher'), addBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, authorize('admin', 'publisher'), updateBlog)
  .delete(protect, authorize('admin', 'publisher'), deleteBlog);

router.route('/:id/photo').put(blogPhotoUpload);

module.exports = router;
