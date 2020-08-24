const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');

dotenv.config({ path: './config/config.env' });

const app = express();

const connectDB = require('./config/db');

connectDB();

//  Route files
const blog = require('./routes/blog');
const auth = require('./routes/auth');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// Cors
app.use(cors());

// Cookie parser
app.use(cookieParser());

// File upload
app.use(fileUpload());

//  Mount routers
app.use('/api/v1/blog', blog);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

//  Listen server
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is runnning in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//  Handle unhandled rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
});
