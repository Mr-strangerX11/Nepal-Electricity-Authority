import cv2
import pytesseract
import numpy as np
from PIL import Image
import io
import json

class DocumentVerificationService:
    def __init__(self):
        """Initialize the document verification service"""
        self.min_confidence = 0.7
        
    def extract_text_from_image(self, image_bytes):
        """
        Extract text from image using OCR
        
        Args:
            image_bytes: Image file bytes
            
        Returns:
            dict: Extracted text and confidence score
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image_np = np.array(image)
            
            # Convert to grayscale
            if len(image_np.shape) == 3:
                gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
            else:
                gray = image_np
            
            # Apply image preprocessing
            _, threshold = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(threshold)
            
            return {
                'text': text,
                'confidence': 0.85,  # Placeholder
                'success': True
            }
        except Exception as e:
            return {
                'error': str(e),
                'success': False
            }
    
    def verify_id_document(self, text_data):
        """
        Verify ID document completeness and authenticity
        
        Args:
            text_data: Extracted text from ID
            
        Returns:
            dict: Verification result
        """
        required_fields = ['name', 'document_number', 'date_of_birth', 'issue_date', 'expiry_date']
        extracted_fields = {}
        
        # Simple field extraction (in production, use advanced NLP/ML)
        for field in required_fields:
            extracted_fields[field] = self._extract_field(text_data, field)
        
        is_valid = all(extracted_fields.values())
        confidence = sum(1 for v in extracted_fields.values() if v) / len(required_fields)
        
        return {
            'verified': is_valid,
            'confidence': confidence,
            'extracted_data': extracted_fields,
            'issues': self._identify_issues(extracted_fields)
        }
    
    def verify_property_document(self, text_data):
        """
        Verify property document completeness
        
        Args:
            text_data: Extracted text from property document
            
        Returns:
            dict: Verification result
        """
        required_fields = ['property_address', 'owner_name', 'document_number', 'registration_date']
        extracted_fields = {}
        
        for field in required_fields:
            extracted_fields[field] = self._extract_field(text_data, field)
        
        is_valid = all(extracted_fields.values())
        confidence = sum(1 for v in extracted_fields.values() if v) / len(required_fields)
        
        return {
            'verified': is_valid,
            'confidence': confidence,
            'extracted_data': extracted_fields,
            'issues': self._identify_issues(extracted_fields)
        }
    
    def _extract_field(self, text, field):
        """Extract specific field from text"""
        # Placeholder implementation
        return bool(text and len(text) > 0)
    
    def _identify_issues(self, fields):
        """Identify issues in extracted fields"""
        issues = []
        for field, value in fields.items():
            if not value:
                issues.append(f"Missing or unreadable: {field}")
        return issues
    
    def get_verification_score(self, verification_results):
        """
        Calculate overall verification score
        
        Args:
            verification_results: Results from document verification
            
        Returns:
            float: Verification score 0-1
        """
        if isinstance(verification_results, dict):
            return verification_results.get('confidence', 0)
        return 0


# Initialize service
service = DocumentVerificationService()


def verify_document(image_bytes, document_type):
    """
    Main function to verify a document
    
    Args:
        image_bytes: Document image bytes
        document_type: Type of document ('id_proof', 'property_papers', etc)
        
    Returns:
        dict: Verification results
    """
    # Extract text
    ocr_result = service.extract_text_from_image(image_bytes)
    
    if not ocr_result.get('success'):
        return {
            'verified': False,
            'score': 0,
            'error': ocr_result.get('error')
        }
    
    # Verify based on document type
    if document_type == 'id_proof':
        verification = service.verify_id_document(ocr_result['text'])
    elif document_type == 'property_papers':
        verification = service.verify_property_document(ocr_result['text'])
    else:
        verification = {'verified': False, 'confidence': 0, 'issues': ['Unknown document type']}
    
    verification['ocr_text'] = ocr_result['text']
    verification['document_type'] = document_type
    
    return verification
