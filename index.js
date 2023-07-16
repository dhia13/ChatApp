const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// const multer = require("multer");
// const uploadMiddleware = require("./middlewares/upload");
const cors = require('cors');
const { loadRoutes } = require('./utils/loadRoutes.js');
require('dotenv').config();
const path = require('path');

const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8000;
const CONNECTION_URL = process.env.CONNECTION_URL;
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(uploadMiddleware());

// Serve front-end
app.use(express.static(path.join(__dirname, 'front', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'build', 'index.html'));
});

// Load routes to the server
loadRoutes(app, './routes');

// Connect to MongoDB and start the server
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    http.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
