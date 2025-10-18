const axios = require('axios');
const Document = require('../models/document');
const fs = require('fs');
const path = require('path');

// @desc    Upload a document
// @route   POST /api/documents/upload
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please upload a file' });
    }

    const { originalname, filename } = req.file;

    const newDocument = new Document({
      originalName: originalname,
      storageName: filename,
      owner: req.user.id,
      status: 'processing',
    });

    const document = await newDocument.save();

    // Trigger the AI service to process the document
    // This is a "fire-and-forget" request; we don't wait for it to finish.
    console.log('Sending document to AI for processing...');
    axios.post(`${process.env.AI_SERVICE_URL}/api/ai/process-document`, {
      storageName: document.storageName,
      documentId: document._id // Send the document ID as well
    }).catch(err => {
      // Log an error if the AI service can't be reached
      console.error('Failed to trigger AI service:', err.message);
    });

    res.status(201).json(document);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all documents for a user
// @route   GET /api/documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ msg: 'Document not found' });
    }

    // Make sure user owns the document
    if (document.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Construct file path and delete the physical file
    const filePath = path.join(__dirname, '..', 'uploads', document.storageName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file from server:', err);
            // We can choose to continue even if file deletion fails
        }
    });

    await Document.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Document removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update document status (called by AI service)
// @route   PUT /api/documents/:id/status
exports.updateDocumentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const document = await Document.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }
        console.log(`Document status updated to: ${status}`);
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};