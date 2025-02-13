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
import asyncio
app = Flask(__name__)
CORS(app)
model = GLiNER.from_pretrained("knowledgator/modern-gliner-bi-large-v1.0")
UPLOAD_FOLDER = '../public'
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
import openai
from dotenv import load_dotenv
load_dotenv()
client = openai.OpenAI(
  api_key="glhf_b4cf220f5e847c019eec846167100ff4",
  base_url="https://glhf.chat/api/openai/v1",
)
def is_image_file(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type and mime_type.startswith('image/')

def is_pdf_file(filename):
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type == 'application/pdf'

def normalize_text(text):
    date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
    text = re.sub(date_pattern, lambda m: m.group().replace('/', '-'), text)
    
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
        temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_path)

        if is_image_file(file.filename):
            extracted_text = extract_text_from_image(temp_path)
        elif is_pdf_file(file.filename):
            with open(temp_path, 'rb') as f:
                pdf_content = f.read()
            extracted_text = extract_text_from_pdf(pdf_content)
        else:
            os.remove(temp_path)
            return jsonify({"error": "Unsupported file type"}), 400

        os.remove(temp_path)

        if not extracted_text:
            return jsonify({"error": "No text could be extracted from the file"}), 400

        cleaned_text = preprocess_text(extracted_text)

        entities = model.predict_entities(cleaned_text, labels, threshold=0.5)
        
        entity_list = [{"text": entity["text"], "label": entity["label"]} 
                      for entity in entities]
       
        return jsonify({
            "message": "Entities extracted successfully",
            "entities": entity_list,
            "extractedText": cleaned_text 
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Error processing file: {str(e)}"
        }), 500


def find_text_matches(source_text, target_text):
    if not source_text or not target_text:
        return []

    source_normalized = normalize_text(source_text)
    target_normalized = normalize_text(target_text)
    if not target_normalized:
        return []

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
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Failed to load image")
        
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        else:
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        image = cv2.resize(image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        image = cv2.GaussianBlur(image, (3,3), 0)
        
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(image, config=custom_config)
        return text.strip()
    except Exception as e:
        print(f"Error in OCR processing: {str(e)}")
        return ""
def extract_text_from_pdf(pdf_content):
    full_text = ""
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            full_text += page.get_text()
    return full_text

def preprocess_text(text):
    text = re.sub(r'\s+', ' ', text)
    
    text = re.sub(r'[^\w\s.,!?@#$%^&*()-]', '', text)
    
    return text.strip()


def process_image_redaction(file, entities, redact_type):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    def get_text_boxes(image):
        custom_config = r'--oem 3 --psm 6'
        data = pytesseract.image_to_data(image, output_type=Output.DICT, config=custom_config)
        
        text_boxes = []
        n_boxes = len(data['text'])
        for i in range(n_boxes):
            if int(data['conf'][i]) > 60:  
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

    def find_text_matches(source_text, target_text):
        """Find matches of target_text in source_text."""
        matches = []
        start_idx = source_text.find(target_text)
        while start_idx != -1:
            end_idx = start_idx + len(target_text)
            matches.append((start_idx, end_idx))
            start_idx = source_text.find(target_text, end_idx)
        return matches

    def redact_matching_text(image, text_boxes, entities, redact_type):
        redacted = image.copy()

        source_text = " ".join([box['text'] for box in text_boxes])
        print(entities)

        if redact_type == "RedactObjects":
            print("FACE")
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

            gray = cv2.cvtColor(redacted, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )

            for (x, y, w, h) in faces:
                cv2.rectangle(redacted, (x, y), (x+w, y+h), (0, 0, 0), -1)
                cv2.putText(
                    redacted,
                    "FACE REDACTED",
                    (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 255, 255),
                    1
                )

                roi_gray = gray[y:y+h, x:x+w]
                eyes = eye_cascade.detectMultiScale(roi_gray)
                for (ex, ey, ew, eh) in eyes:
                    cv2.rectangle(
                        redacted,
                        (x + ex, y + ey),
                        (x + ex + ew, y + ey + eh),
                        (0, 0, 0),
                        -1
                    )

        for entity in entities:
            target_text = entity['text']
            matches = find_text_matches(source_text, target_text)
            
            for start_idx, end_idx in matches:
                for box in text_boxes:
                    if target_text in box['text']:
                        x, y, w, h = box['bbox']
                        padding = int(h * 0.1)
                        
                        replacement = entity.get('label', 'REDACTED')
                        font = cv2.FONT_HERSHEY_SIMPLEX
                        font_scale = h / 30
                        thickness = 1
                        
                        (text_w, text_h), _ = cv2.getTextSize(
                            replacement, font, font_scale, thickness
                        )
                        
                        while text_w > w and font_scale > 0.3:
                            font_scale -= 0.1
                            (text_w, text_h), _ = cv2.getTextSize(
                                replacement, font, font_scale, thickness
                            )
                        
                        text_x = x + (w - text_w) // 2
                        text_y = y + (h + text_h) // 2
                        
                        if redact_type == "BlackOut" or redact_type=="RedactObjects":
                            cv2.rectangle(
                                redacted,
                                (x - padding, y - padding),
                                (x + w + padding, y + h + padding),
                                (0, 0, 0),
                                -1,
                            )
                            cv2.putText(
                                redacted,
                                "",
                                (text_x, text_y),
                                font,
                                font_scale,
                                (255, 255, 255),
                                thickness,
                            )
                        
                        elif redact_type == "Vanishing":
                            cv2.rectangle(
                                redacted,
                                (x - padding, y - padding),
                                (x + w + padding, y + h + padding),
                                (255, 255, 255),
                                -1,
                            )
                        
                        elif redact_type == "Blurring":
                            x1, y1 = max(0, x - padding), max(0, y - padding)
                            x2, y2 = min(image.shape[1], x + w + padding), min(image.shape[0], y + h + padding)
                            roi = redacted[y1:y2, x1:x2]
                            blurred_roi = cv2.GaussianBlur(roi, (15, 15), 0)
                            redacted[y1:y2, x1:x2] = blurred_roi
                        
                        elif redact_type in ["CategoryReplacement", "SyntheticReplacement"]:
                            cv2.rectangle(
                                redacted,
                                (x - padding, y - padding),
                                (x + w + padding, y + h + padding),
                                (255, 255, 255),
                                -1,
                            )
                            cv2.putText(
                                redacted,
                                replacement,
                                (text_x, text_y),
                                font,
                                font_scale,
                                (0, 0, 0),
                                thickness,
                            )
        
        return redacted

    try:
        image = cv2.imread(file_path)
        if image is None:
            raise ValueError("Failed to load image for redaction")
        
        text_boxes = get_text_boxes(image)
        
        redacted_image = redact_matching_text(image, text_boxes, entities, redact_type)
        
        output_path = os.path.join(UPLOAD_FOLDER, "redacted_image.jpg")
        cv2.imwrite(output_path, redacted_image)
        
        return output_path

    except Exception as e:
        raise Exception(f"Error in image redaction: {str(e)}")
async def process_pdf_redaction(pdf_content, entities, redact_type):
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page_number, page in enumerate(doc):
            if redact_type == "Blurring":
                for entity in entities:
                    areas = page.search_for(entity['text']) 
                    for area in areas:
                        try:
                            blur_annot = page.add_redact_annot(area, fill=(255, 255, 255)) 
                        except Exception as e:
                            print(f"Error blurring text on page {page_number}: {str(e)}")
                            continue
                page.apply_redactions() 
            else:
                for entity in entities:
                    areas = page.search_for(entity['text'])
                    cleaned_text = preprocess_text(page.get_text())

                    for area in areas:
                        try:
                            if redact_type == "SyntheticReplacement":
                                font_size = (area[3] - area[1]) * 0.6
                                if not cleaned_text or not entities:
                                    return jsonify({"error": "Invalid input data"}), 400
                                
                                modified_text = cleaned_text
                                entity_text = entity["text"]
                                label = entity["label"]
                                
                                context_start = max(0, modified_text.find(entity_text) - 100)
                                context_end = min(len(modified_text), modified_text.find(entity_text) + len(entity_text) + 100)
                                context = modified_text[context_start:context_end]
                                print(context)
                                completion = client.chat.completions.create(
                                    model="hf:meta-llama/Llama-3.3-70B-Instruct",
                                    messages=[
                                        {"role": "system", "content": "You are a helpful assistant which generates synthetic replacements for given entities."},
                                        {"role": "user", "content": f"Context:{context} Entity_TEXT:{entity_text} Label:{label}. Generate ONE synthetic entity similar to the entity without any additional information and text."}
                                    ]
                                )
                                synthetic_replacement = completion.choices[0].message.content.strip()
                                synthetic_replacement = synthetic_replacement.split()[0]
                                print(synthetic_replacement)
                                annot = page.add_redact_annot(
                                    area, 
                                    text=synthetic_replacement, 
                                    text_color=(0, 0, 0), 
                                    fontsize=font_size
                                )
                            else:
                                if redact_type == "BlackOut":
                                    annot = page.add_redact_annot(area, fill=(0, 0, 0))
                                elif redact_type == "Vanishing":
                                    annot = page.add_redact_annot(area, fill=(1, 1, 1))
                                elif redact_type == "CategoryReplacement":
                                    font_size = (area[3]-area[1])*0.6
                                    annot = page.add_redact_annot(area, text=entity['label'], 
                                                    text_color=(0, 0, 0), fontsize=font_size)
                                annot.update()
                        except Exception as e:
                            print(f"Error processing redaction on page {page_number}: {str(e)}")
                            continue
                
                page.apply_redactions()
        
        output_path = os.path.join(UPLOAD_FOLDER, "redacted_document.pdf")
        doc.save(output_path)
        return output_path


@app.route('/api/redactEntity', methods=['POST'])
async def redact_entity():
    print(request.files)
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "File not provided"}), 400

    entities = json.loads(request.form.get('entities', '[]'))
   
    redact_type = request.args.get('type', 'BlackOut')
    print(redact_type)
    if is_image_file(file.filename):
        output_path =process_image_redaction(file, entities,redact_type)
        redacted_url = url_for('static', 
                                filename=f"../public/redacted_image.jpg", 
                                _external=True)
        return jsonify({
            "message": "Image redacted successfully",
            "redacted_file_url": redacted_url
        }), 200
        
    elif is_pdf_file(file.filename):
        pdf_content = file.read()
        output_path =await  process_pdf_redaction(pdf_content, entities, redact_type)
        print("hiiii")
        return jsonify({
            "message": "PDF redacted successfully",
            "output_file": os.path.basename(output_path)
        }), 200
        
            
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)