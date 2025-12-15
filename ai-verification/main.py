from flask import Flask, request, jsonify
from document_verifier import verify_document
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'AI Verification Service'})

@app.route('/verify', methods=['POST'])
def verify():
    """
    Verify uploaded document
    Expected form data:
    - document: file (binary)
    - document_type: string (id_proof, property_papers, etc)
    """
    try:
        if 'document' not in request.files:
            return jsonify({'error': 'No document provided'}), 400
        
        document = request.files['document']
        document_type = request.form.get('document_type', 'other')
        
        if document.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Read file bytes
        image_bytes = document.read()
        
        # Verify document
        result = verify_document(image_bytes, document_type)
        
        return jsonify({
            'success': True,
            'verification': result
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/verify-batch', methods=['POST'])
def verify_batch():
    """
    Verify multiple documents at once
    """
    try:
        documents = request.files.getlist('documents')
        document_types = request.form.getlist('document_types')
        
        results = []
        for i, document in enumerate(documents):
            doc_type = document_types[i] if i < len(document_types) else 'other'
            image_bytes = document.read()
            result = verify_document(image_bytes, doc_type)
            results.append(result)
        
        return jsonify({
            'success': True,
            'results': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, port=port)
