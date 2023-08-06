const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createFoldersIfNotExist = () => {
  const StorageRootDir = path.join(__dirname, '../', 'storage');
  const audioDir = path.join(StorageRootDir, 'audios');
  const imageDir = path.join(StorageRootDir, 'images');
  if (!fs.existsSync(StorageRootDir)) {
    fs.mkdirSync(StorageRootDir);
  }

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
  }

  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }
};

const multerSetup = () => {
  // Create the folders on server startup
  createFoldersIfNotExist();

  // Set up Multer to handle file uploads and store them in the appropriate directories.
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file);
      const StorageRootDir = path.join(__dirname, '../', 'storage');
      const audioDir = path.join(StorageRootDir, 'audios');
      const imageDir = path.join(StorageRootDir, 'images');
      if (file.fieldname === 'audio') {
        cb(null, audioDir);
      } else if (file.fieldname === 'image') {
        cb(null, imageDir);
      } else {
        cb(new Error('Invalid fieldname'));
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename
    },
  });

  return multer({ storage });
};

module.exports = { multerSetup };
