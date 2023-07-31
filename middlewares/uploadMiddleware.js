const multer = require("multer");

// Create a storage engine for multer
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();

    // Construct the filename: timestamp + random number + original file extension
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

// Configure the multer middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size: 10MB (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("application/pdf") ||
      file.mimetype.startsWith("audio/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format."));
    }
  },
});

module.exports = upload;
