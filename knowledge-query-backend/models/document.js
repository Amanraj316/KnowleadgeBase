const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  originalName: { 
    type: String, 
    required: true 
  },
  storageName: { 
    type: String, 
    required: true, 
    unique: true 
  }, // The unique name we give the file on our server
  status: { 
    type: String, 
    enum: ['processing', 'ready', 'error'], 
    default: 'processing' 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  } // Links the document to the user who uploaded it
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);