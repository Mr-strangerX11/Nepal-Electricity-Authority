const axios = require('axios');
require('dotenv').config();

class DocumentService {
  // Call AI verification service
  static async verifyDocument(imageBuffer, documentType) {
    try {
      const formData = new FormData();
      formData.append('document', new Blob([imageBuffer], { type: 'image/jpeg' }), 'document.jpg');
      formData.append('document_type', documentType);

      const response = await axios.post(
        `${process.env.AI_SERVICE_URL}/verify`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${process.env.AI_SERVICE_KEY}`
          }
        }
      );

      return {
        success: true,
        verification: response.data.verification
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload document to Cloudinary
  static async uploadToCloudinary(file, folder = 'nea-documents') {
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        public_id: `${file.filename}-${Date.now()}`
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Save document metadata to database
  static async saveDocumentMetadata(pool, applicationId, documentType, fileUrl, publicId, verificationScore) {
    try {
      const result = await pool.query(
        `INSERT INTO documents 
         (application_id, document_type, file_url, cloudinary_public_id, ai_verification_score, verification_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [applicationId, documentType, fileUrl, publicId, verificationScore, verificationScore > 0.7 ? 'verified' : 'pending']
      );

      return {
        success: true,
        document: result.rows[0]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = DocumentService;
