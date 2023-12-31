const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const path = require('path');
const corsMiddleware = require('./middlewares/corsMiddleware');
const { createLogMiddleware } = require('./middlewares/loggerMiddleware');
const AuthMiddleware = require('./middlewares/authMiddleware');
const app = express();
const setupSocketServer = require('./middlewares/socketMiddleware');

const server = http.createServer(app);
const port = process.env.PORT || 8000;
const CONNECTION_URL = process.env.CONNECTION_URL;
const socketMiddleware = setupSocketServer(server);
// middleware

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(socketMiddleware);
app.use(AuthMiddleware);
app.use(helmet());
// app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(createLogMiddleware(process.env.WRITETOFILE));

// Load routes to the server
const routersDir = path.join(__dirname, 'routes');
function loadRoutes(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadRoutes(filePath);
    } else if (stat.isFile() && file.endsWith('.js')) {
      const router = require(filePath);
      if (typeof router === 'function') {
        app.use('/api/v1/', router);
      }
    }
  });
}

loadRoutes(routersDir);

// Serve front-end

app.use(express.static(path.join(__dirname, 'front/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'front/build/index.html'))
);
// Fallback route for 404 errors
app.use((req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, 'public', 'pages', '404', 'index.html'));
});

// Connect to MongoDB and start the server
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`${error} did not connect`);
  });
