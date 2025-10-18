const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadDocument, getDocuments, deleteDocument,updateDocumentStatus } = require('../controllers/documentController');
const auth = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// @route    POST api/documents/upload
// @desc     Upload a document for the user
// @access   Private
router.post('/upload', auth, upload.single('document'), uploadDocument);

// @route    GET api/documents
// @desc     Get all documents for the user
// @access   Private
router.get('/', auth, getDocuments);

// @route    DELETE api/documents/:id
// @desc     Delete a user's document
// @access   Private
router.delete('/:id', auth, deleteDocument);

router.put('/:id/status', updateDocumentStatus);

module.exports = router;