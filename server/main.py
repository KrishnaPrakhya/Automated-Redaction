from flask import Flask, jsonify, request, json, send_from_directory, url_for
from flask_cors import CORS
import fitz
import re
import cv2
import pytesseract
from pytesseract import Output
import os
from gliner import GLiNER
import mimetypes
import numpy as np

app = Flask(__name__)
CORS(app)

model = GLiNER.from_pretrained("urchade/gliner_small-v2.1")
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

labels = [
    "PERSON_NAME",
    "DATE_OF_BIRTH",
    "AGE",
    "GENDER",
    "NATIONALITY",
    "MARITAL_STATUS",
    
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "MOBILE_NUMBER",
    "FAX_NUMBER",
    "POSTAL_ADDRESS",
    "PERMANENT_ADDRESS",
    
    "CITY",
    "STATE",
    "COUNTRY",
    "ZIP_CODE",
    "LANDMARK",
    
    "OCCUPATION",
    "JOB_TITLE",
    "EMPLOYER_NAME",
    "WORK_ADDRESS",
    "WORK_EXPERIENCE",
    "SKILLS",
    
    "QUALIFICATION",
    "INSTITUTION_NAME",
    "GRADUATION_YEAR",
    "ACADEMIC_SCORE",
    "CERTIFICATION",
    "SPECIALIZATION",
    
    "BANK_NAME",
    "ACCOUNT_NUMBER",
    "IFSC_CODE",
    "CREDIT_CARD_NUMBER",
    "PAN_NUMBER",
    "TAX_ID",
    "SALARY",
    "INCOME",
    
    "TRANSACTION_ID",
    "TRANSACTION_DATE",
    "AMOUNT",
    "PAYMENT_METHOD",
    "CURRENCY",
    "MERCHANT_NAME",
    
    "ID_NUMBER",
    "PASSPORT_NUMBER",
    "DRIVING_LICENSE",
    "VOTER_ID",
    "AADHAR_NUMBER",
    
    "ENROLLMENT_NUMBER",
    "REGISTRATION_NUMBER",
    "COURSE_NAME",
    "SEMESTER",
    "SUBJECT_NAME",
    "GRADE",
    "ATTENDANCE_PERCENTAGE",
    
    "POLICY_NUMBER",
    "POLICY_TYPE",
    "PREMIUM_AMOUNT",
    "COVERAGE_AMOUNT",
    "EXPIRY_DATE",
    
    "LOAN_ACCOUNT_NUMBER",
    "LOAN_TYPE",
    "LOAN_AMOUNT",
    "INTEREST_RATE",
    "EMI_AMOUNT",
    
    "DATE",
    "TIME",
    "DURATION",
    "PERIOD",
    
    "MEDICAL_RECORD_NUMBER",
    "DIAGNOSIS",
    "MEDICATION",
    "BLOOD_GROUP",
    
    "VEHICLE_NUMBER",
    "CHASSIS_NUMBER",
    "ENGINE_NUMBER",
    "MODEL_NUMBER",
    
    "ORGANIZATION_NAME",
    "REGISTRATION_NUMBER",
    "DEPARTMENT_NAME",
    "BRANCH_NAME",
    
    "IP_ADDRESS",
    "MAC_ADDRESS",
    "URL",
    "USERNAME",
    
    "SOCIAL_MEDIA_HANDLE",
    "PROFILE_ID",
    "ACCOUNT_USERNAME",
    
    "PROJECT_NAME",
    "PROJECT_ID",
    "CLIENT_NAME",
    "DEADLINE_DATE",
    
    "EVENT_NAME",
    "EVENT_DATE",
    "VENUE",
    "ORGANIZER_NAME"
]

def is_image_file(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type and mime_type.startswith('image/')

def is_pdf_file(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type == 'application/pdf'

def normalize_text(text):
    """Normalize text to handle different date formats and variations."""
    # Handle date formats
    date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
    text = re.sub(date_pattern, lambda m: m.group().replace('/', '-'), text)
    
    # Remove extra spaces and normalize case
    text = ' '.join(text.split()).lower()
    return text

@app.route('/api/entities', methods=['POST'])
def entities():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # Save the uploaded file temporarily
        temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_path)

        # Extract text based on file type
        if is_image_file(file.filename):
            # Process image file
            extracted_text = extract_text_from_image(temp_path)
        elif is_pdf_file(file.filename):
            # Process PDF file
            with open(temp_path, 'rb') as f:
                pdf_content = f.read()
            extracted_text = extract_text_from_pdf(pdf_content)
        else:
            os.remove(temp_path)
            return jsonify({"error": "Unsupported file type"}), 400

        # Clean up temporary file
        os.remove(temp_path)

        if not extracted_text:
            return jsonify({"error": "No text could be extracted from the file"}), 400

        # Preprocess the extracted text
        cleaned_text = preprocess_text(extracted_text)

        # Predict entities using the model
        entities = model.predict_entities(cleaned_text, labels, threshold=0.5)
        
        # Format the entities
        entity_list = [{"text": entity["text"], "label": entity["label"]} 
                      for entity in entities]
       
        return jsonify({
            "message": "Entities extracted successfully",
            "entities": entity_list,
            "extractedText": cleaned_text  # Optional: return extracted text for verification
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Error processing file: {str(e)}"
        }), 500

def find_text_matches(source_text, target_text):
    """Find all occurrences of target text in source text with fuzzy matching."""
    source_normalized = normalize_text(source_text)
    target_normalized = normalize_text(target_text)
    
    matches = []
    start = 0
    while True:
        idx = source_normalized.find(target_normalized, start)
        if idx == -1:
            break
        matches.append((idx, idx + len(target_normalized)))
        start = idx + 1
    return matches

def extract_text_from_image(image_path):
    """Extract text from image using OCR with improved configuration."""
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Failed to load image")
        
        # Convert to RGB
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        else:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Improve image quality for OCR
        image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        image = cv2.GaussianBlur(image, (3,3), 0)
        
        # Configure Tesseract for better accuracy
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, config=custom_config)
        return text.strip()
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        return ""
def extract_text_from_pdf(pdf_content):
    """Extract text from PDF."""
    full_text = ""
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            full_text += page.get_text()
    return full_text

def preprocess_text(text):
    """Clean and preprocess extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters while keeping basic punctuation
    text = re.sub(r'[^\w\s.,!?-]', '', text)
    return text.strip()



def process_image_redaction(file, entities,redact_type):
    """Improved image redaction with better text detection and matching."""
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    def get_text_boxes(image):
        """Get text boxes with improved detection."""
        custom_config = r'--oem 3 --psm 6'
        data = pytesseract.image_to_data(image, output_type=Output.DICT, config=custom_config)
        
        text_boxes = []
        n_boxes = len(data['text'])
        for i in range(n_boxes):
            if int(data['conf'][i]) > 60:  # Confidence threshold
                text = data['text'][i].strip()
                if text:
                    x, y, w, h = (data['left'][i], data['top'][i],
                                data['width'][i], data['height'][i])
                    text_boxes.append({
                        'text': text,
                        'bbox': (x, y, w, h),
                        'conf': data['conf'][i]
                    })
        return text_boxes

    def redact_matching_text(image, text_boxes, entities,redact_type):
        """Redact text with improved matching."""
        redacted = image.copy()
        
        for entity in entities:
            target_text = entity['text']
            for box in text_boxes:
                if find_text_matches(box['text'], target_text):
                    x, y, w, h = box['bbox']
                    # Add padding to ensure complete coverage
                    padding = int(h * 0.1)
                    cv2.rectangle(redacted,
                                (x - padding, y - padding),
                                (x + w + padding, y + h + padding),
                                (0, 0, 0), -1)
                    
                    # Add replacement text
                    replacement = entity.get('label', 'REDACTED')
                    font = cv2.FONT_HERSHEY_SIMPLEX
                    font_scale = h / 30
                    thickness = 1
                    
                    # Adjust font size to fit
                    (text_w, text_h), _ = cv2.getTextSize(replacement, font, font_scale, thickness)
                    while text_w > w and font_scale > 0.3:
                        font_scale -= 0.1
                        (text_w, text_h), _ = cv2.getTextSize(replacement, font, font_scale, thickness)
                    
                    text_x = x + (w - text_w) // 2
                    text_y = y + (h + text_h) // 2
                    if redact_type == "BlackOut":
                        cv2.putText(redacted, "",
                              (text_x, text_y), font, font_scale,
                              (255, 255, 255), thickness)
                    elif redact_type == "Vanishing":
                        cv2.putText(redacted, "",
                              (text_x, text_y), font, font_scale,
                              (0, 0, 0), thickness)
                    elif redact_type == "Blurring":
                        cv2.putText(redacted, "",
                              (text_x, text_y), font, font_scale,
                              (18, 200, 19), thickness)
                    elif redact_type == "CategoryReplacement":
                        cv2.putText(redacted, replacement,
                                (text_x, text_y), font, font_scale,
                                (255, 255, 255), thickness)
        
        return redacted

    try:
        # Load and preprocess image
        image = cv2.imread(file_path)
        if image is None:
            raise ValueError("Failed to load image for redaction")
        
        # Get text boxes
        text_boxes = get_text_boxes(image)
        
        # Perform redaction
        redacted_image = redact_matching_text(image, text_boxes, entities,redact_type)
        
        # Save result
        output_path = os.path.join(UPLOAD_FOLDER, f"redacted_{file.filename}")
        cv2.imwrite(output_path, redacted_image)
        
        return output_path
        
    except Exception as e:
        raise Exception(f"Error in image redaction: {str(e)}")
def process_pdf_redaction(pdf_content, entities, redact_type):
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            for entity in entities:
                areas = page.search_for(entity['text'])
                for area in areas:
                    if redact_type == "BlackOut":
                        page.add_redact_annot(area, fill=(0, 0, 0))
                    elif redact_type == "Vanishing":
                        page.add_redact_annot(area, fill=(1, 1, 1))
                    elif redact_type == "Blurring":
                        page.add_redact_annot(area, fill=(1, 1, 0))
                    elif redact_type == "CategoryReplacement":
                        font_size = (area[3]-area[1])*0.6
                        annot = page.add_redact_annot(area, text=entity['label'], 
                                                    text_color=(0, 0, 0), fontsize=font_size)
                        annot.update()
            page.apply_redactions()
        
        output_path = os.path.join(UPLOAD_FOLDER, "redacted_document.pdf")
        doc.save(output_path)
        return output_path

@app.route('/api/redactEntity', methods=['POST'])
def redact_entity():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "File not provided"}), 400

    try:
        entities = json.loads(request.form.get('entities', '[]'))
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON for entities"}), 400
    
    redact_type = request.args.get('type', 'BlackOut')
    
    try:
        if is_image_file(file.filename):
            output_path = process_image_redaction(file, entities,redact_type)
            redacted_url = url_for('static', 
                                 filename=f"uploads/redacted_{file.filename}", 
                                 _external=True)
            return jsonify({
                "message": "Image redacted successfully",
                "redacted_file_url": redacted_url
            }), 200
            
        elif is_pdf_file(file.filename):
            pdf_content = file.read()
            output_path = process_pdf_redaction(pdf_content, entities, redact_type)
            return jsonify({
                "message": "PDF redacted successfully",
                "output_file": os.path.basename(output_path)
            }), 200
            
        else:
            return jsonify({"error": "Unsupported file type"}), 400
            
    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500
if __name__ == "__main__":
    app.run(port=5000, debug=True)