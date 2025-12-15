# AI Document Verification Service

Python-based AI service for verifying electricity connection documents using OCR and machine learning.

## Overview

Automatically extracts and verifies information from:
- ID documents (citizenship, passport, driver's license)
- Property documents (land deed, ownership papers)
- Supporting documents (utility bills, rent agreements)

## Quick Start

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Service runs on `http://localhost:5001`

## Installation

### Requirements
- Python 3.8+
- Tesseract OCR engine

### macOS
```bash
brew install tesseract
pip install -r requirements.txt
```

### Ubuntu/Debian
```bash
sudo apt-get install tesseract-ocr
pip install -r requirements.txt
```

### Windows
Download Tesseract installer: https://github.com/UB-Mannheim/tesseract/wiki

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "AI Verification Service"
}
```

### Verify Single Document
```
POST /verify
Content-Type: multipart/form-data

Parameters:
- document (file) - Document image
- document_type (string) - Type: id_proof, property_papers, other
```

Response:
```json
{
  "success": true,
  "verification": {
    "verified": true,
    "confidence": 0.92,
    "document_type": "id_proof",
    "ocr_text": "...",
    "extracted_data": {
      "name": "John Doe",
      "document_number": "12345678",
      "date_of_birth": "1990-01-01"
    },
    "issues": []
  }
}
```

### Verify Batch Documents
```
POST /verify-batch
Content-Type: multipart/form-data

Parameters:
- documents (files) - Multiple documents
- document_types (strings) - Types for each document
```

## Configuration

Create `.env` file:
```
PORT=5001
DEBUG=False
MIN_CONFIDENCE=0.7
TESSERACT_PATH=/usr/bin/tesseract  # Adjust based on OS
```

## Document Processing

### OCR Process
1. Image preprocessing (grayscale, threshold)
2. Text extraction using Tesseract
3. Field extraction and parsing
4. Validation against templates

### Verification Score
- Confidence score: 0-1 (higher is better)
- Fields verified: number of required fields found
- Overall score: average of confidence and field completion

### Supported Document Types

**ID Proof**
- Required fields: name, document_number, date_of_birth, issue_date, expiry_date
- Supported formats: Citizenship, Passport, Driver's License

**Property Documents**
- Required fields: property_address, owner_name, document_number, registration_date
- Supported formats: Land Deed, Ownership Certificate

## Testing

```bash
pytest
pytest -v  # Verbose output
pytest --cov  # With coverage report
```

## Performance Optimization

- Image compression before processing
- Caching of OCR results
- Batch processing support
- Parallel processing for multiple documents

## Error Handling

Returns detailed error messages:
```json
{
  "success": false,
  "error": "No document provided"
}
```

## Limitations

- Works best with clear, well-lit images
- Document must be in portrait orientation
- Resolution: minimum 300 DPI recommended
- Supported formats: JPG, PNG, PDF

## Improving Accuracy

1. **Better Images**
   - Use high-resolution camera (12MP+)
   - Good lighting (no shadows/glare)
   - Straight angle (90 degrees)
   - Full document visible

2. **Model Training**
   - Train custom models for Nepali documents
   - Adjust confidence thresholds
   - Add more training data

## Deployment

### Docker
```bash
docker build -t nea-ai-service .
docker run -p 5001:5001 nea-ai-service
```

### Heroku
```bash
heroku create nea-ai-verification
git push heroku main
```

## Troubleshooting

**Tesseract not found**
```bash
# macOS
brew install tesseract

# Linux
sudo apt-get install tesseract-ocr

# Set TESSERACT_PATH in .env if not in default location
```

**Low accuracy on Nepali documents**
- Use language data for Nepali (tesseract-ocr-nep)
- Train custom model with Nepali document samples

**Memory issues with large images**
- Implement image resizing
- Use batch processing instead of single requests

## Future Enhancements

- [ ] Support for more document types
- [ ] Liveness detection for selfies
- [ ] Document authentication verification
- [ ] Multi-language support
- [ ] Real-time processing with WebSocket
- [ ] Model fine-tuning interface

## Contributing

Contribute improvements to document verification:
1. Add test documents
2. Improve extraction logic
3. Optimize performance
4. Add language support

## Support

For issues and improvements: support@nea-electricity.gov.np
