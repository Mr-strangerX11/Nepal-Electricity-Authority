const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  applicationId: {
    type: Number,
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['id_proof', 'property_papers', 'land_document', 'other'],
    required: true
  },
  fileUrl: String,
  cloudinaryPublicId: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  ocrText: String,
  aiVerificationScore: Number,
  aiVerificationDetails: {
    documentType: String,
    extractedData: {
      name: String,
      documentNumber: String,
      issueDate: String,
      expiryDate: String,
      address: String
    },
    confidence: Number,
    issues: [String]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: Date
});

module.exports = mongoose.model('Document', documentSchema);
