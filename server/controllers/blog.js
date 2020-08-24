const Blog = require('../models/Blog');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.getBlogs = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((param) => {
    delete reqQuery[param];
  });

  query = Blog.find(reqQuery);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const startIndex = (page - 1) * limit;
  const total = await Blog.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const blogs = await query;

  res.status(200).json({
    success: true,
    count: total,
    data: blogs,
  });
});

exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});

exports.addBlog = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog,
  });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this blog`,
        404
      )
    );
  }

  blog = await Blog.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: blog,
  });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this blog`,
        404
      )
    );
  }

  await blog.remove();

  res.status(200).json({
    success: true,
  });
});

exports.blogPhotoUpload = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Blog.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
