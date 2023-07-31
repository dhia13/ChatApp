const uploadCtrl = {
  uploadImg: async (req, res) => {
    console.log('got to controller');
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    // File upload was successful
    return res.status(201).json({ success: 'File uploaded.' });
  },
};

module.exports = uploadCtrl;
