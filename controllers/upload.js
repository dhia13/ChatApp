const uploadCtrl = {
  post : async (req, res) => {
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    // File upload was successful
    return res.json({ success: "File uploaded." });
  }
};

module.exports = uploadCtrl;
