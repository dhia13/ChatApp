const express = require('express');
const path = require('path');

function notFoundMiddleware(req, res, next) {
  res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
}

module.exports = notFoundMiddleware;
