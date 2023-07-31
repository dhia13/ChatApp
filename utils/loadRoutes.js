const fs = require('fs');
const path = require('path');

const loadRoutes = (app, directory, routePrefix = '/api/v1') => {
  const absoluteDirectory = path.resolve(__dirname, '..', directory);

  fs.readdirSync(absoluteDirectory).forEach((file) => {
    const filePath = path.join(absoluteDirectory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Recursively load routes from subdirectories
      const subdirectory = path.join(directory, file);
      loadRoutes(app, subdirectory, routePrefix);
    } else if (file === 'index.js') {
      // Load and link the route file
      const route = require(filePath);
      app.use(routePrefix, route);
    }
  });
};

module.exports = {
  loadRoutes,
};
