const uploadCtrl = {
  uploadAudio: async (req, res) => {
    console.log('got here');
    console.log(req.file);
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    // File upload was successful
    return res.status(201).json({ success: 'File uploaded.' });
  },
};

module.exports = uploadCtrl;
