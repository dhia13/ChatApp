const routersDir = path.join(__dirname, "router");
function loadRoutes(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadRoutes(filePath);
    } else if (stat.isFile() && file.endsWith(".js")) {
      const router = require(filePath);
      if (typeof router === "function") {
        app.use("/", router);
      }
    }
  });
}
loadRoutes(routersDir);