from posixpath import dirname
from flask import Flask,jsonify,request,json,send_from_directory,url_for
from flask_cors import CORS
import fitz  
import re
import sys
import torch
import uuid
from gliner import GLiNERConfig,GLiNER
from gliner.training import Trainer,TrainingArguments
from gliner.data_processing.collator import DataCollatorWithPadding,DataCollator
from gliner.utils import load_config_as_namespace
from gliner.data_processing import WordsSplitter,GLiNERDataset
import os
import requests
import cv2
app=Flask(__name__)
CORS(app)

model = GLiNER.from_pretrained("urchade/gliner_small-v2.1")
labels = [
    "Person",
    "name",
    "DATE",
    "age",
    "number",
    "gmail",
    "city",
    "place",
    "occupation",
    "language",
    "ACCOUNT INFORMATION",
    "TRANSACTION DETAILS",
    "INVESTMENT DETAILS",
    "LOAN DETAILS",
    "INSURANCE POLICIES",
    "INCOME AND EARNINGS",
    "EXPENDITURE AND BUDGET",
    "TAX DETAILS",
    "ACADEMIC RECORDS",
    "ENROLLMENT DETAILS",
    "COURSES AND PROGRAMS",
    "ASSESSMENTS AND EXAMS",
    "EXTRACURRICULAR ACTIVITIES",
    "SCHOLARSHIPS",
    "ATTENDANCE AND DISCIPLINE",
    "PROJECTS AND ASSIGNMENTS"
]
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.route('/api/data',methods=['GET'])
def get_data():
  return jsonify({"message":"THis is a message"})

@app.route('/api/upload', methods=['POST'])
def upload_data():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file:
        print(f"File received: {file.filename}")
        return jsonify({"file": "Uploaded successfully"}), 200
    else:
        return jsonify({"error": "No file uploaded"}), 400



@app.route("/api/image",methods=["POST"])
def imageRedaction():
    import cv2
    import pytesseract
    from pytesseract import Output
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    def detect_text_properties(image):
        
        data = pytesseract.image_to_data(image, output_type=Output.DICT)
        text_info = []
        
        for i in range(len(data['text'])):
            if data['text'][i].strip():  
                x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                text = data['text'][i]
                font_size = h  
                text_info.append({
                    "text": text,
                    "position": (x, y, w, h),
                    "font_size": font_size
                })
        return text_info
    def redact_text(image, text_info, redact_list, replacement_text="REDACTED"):
        redacted_img = image.copy()
        
        for info in text_info:
            x, y, w, h = info["position"]
            text = info["text"]
            font_size = info["font_size"]
            
            if text in redact_list:
                cv2.rectangle(redacted_img, (x, y), (x+w, y+h), (1, 1, 1), -1)
                
                font = cv2.FONT_HERSHEY_SIMPLEX
                font_scale = font_size / 30  
                thickness = 1
                
                (text_width, text_height), baseline = cv2.getTextSize(replacement_text, font, font_scale, thickness)
                
                while text_width > w or text_height > h and font_scale>0.5:
                    font_scale-=0.1
                    (text_width, text_height), baseline = cv2.getTextSize(replacement_text, font, font_scale, thickness)
                    
                    
                text_x = x + (w - text_width) // 2
                text_y = y + (h + text_height) // 2 - baseline
                
                cv2.putText(redacted_img, replacement_text, (text_x, text_y), font, font_scale, (255, 255, 255), thickness)
        
        return redacted_img
    print(f"uploads/{file.filename}")
    processed_image=cv2.imread(f"uploads/{file.filename}")
    
    predicted_words_to_redact = ["Desktop","Laptop"]

    text_info = detect_text_properties(processed_image)

    redacted_image = redact_text(processed_image, text_info, predicted_words_to_redact)

    output_dir="output"
    cv2.imwrite(f"{output_dir}/redacted_image.jpg", redacted_image)
    redacted_image_url = url_for("static", filename="output/redacted_image.jpg", _external=True)
   
    return jsonify({
            "message": "Redaction completed successfully",
            "redacted_image_path": redacted_image_url,
        }), 200




@app.route('/api/redactEntity',methods=['POST'])
def redactEntity():
    pdf_file = request.files.get('file')
    print(pdf_file)
    if not pdf_file:
        return jsonify({"error": "File not provided"}), 400

    entities = request.form.get('entities')
    if not entities:
        return jsonify({"error": "Entities not provided"}), 400
    try:
        entities = json.loads(entities)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON for entities"}), 400
    
    redact_type=request.args.get('type')
    
    print(redact_type)

    entities_categories_list=[]
    entities_list=[]
    print(entities)
    for i in entities:
        entities_list.append(i['text'])
        entities_categories_list.append(i['label'])
    print(entities_list)
    print(entities_categories_list)
    pdf_content = pdf_file.read()
    
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        rect_area=[]
        for page in doc:
            for word, entity in zip(entities_list, entities_categories_list):
                # print(word)
                # print(entity)
                areas = page.search_for(word)
                for area in areas:
                    if redact_type == "BlackOut":
                        page.add_redact_annot(area, fill=(0, 0, 0))
                    elif redact_type == "Vanishing":
                        page.add_redact_annot(area, fill=(1, 1, 1))
                    elif redact_type == "Blurring":
                        page.add_redact_annot(area, fill=(1, 1, 0))
                    elif redact_type=="CategoryReplacement":
                        font_size = (area[3]-area[1])*0.6
                        print(font_size)
                        annot = page.add_redact_annot(area, text = entity, text_color = fitz.utils.getColor("black"), fontsize = font_size)
                        annot.update()
                        print("Level2")
                    elif redact_type=="SyntheticReplacement":
                        print("Level3")
            page.apply_redactions()
        for area in rect_area:
            doc[0].insert_text(area, "Teacher", fontsize=10, color=(0, 0, 0), overlay=True)  

        redacted_file = f"new2.pdf"
        doc.save(redacted_file) 

    return jsonify({
        "message": "File redacted successfully",
        "output_file": redacted_file
    }), 200

  


@app.route('/api/entities', methods=['POST'])
def entities():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if not file or file.filename == '':
        return jsonify({"error": "No file uploaded"}), 400

    pdf_content = file.read()
    
    full_texts = ""
    with fitz.open(stream=pdf_content, filetype="pdf") as doc:
        for page in doc:
            full_texts += page.get_text()

    def preprocess_whitespace(text):
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    cleaned_text = preprocess_whitespace(full_texts)

    entities = model.predict_entities(cleaned_text, labels, threshold=0.5)
    redact_words = []
    entity_list = []

    for entity in entities:
        entity_list.append({"text":entity["text"],"label":entity["label"]})
        redact_words.append(entity["text"])

    

    return jsonify({
        "message": "File redacted successfully",
        # "output": redacted_file,
        "entities": entity_list
    }), 200
if __name__ == "__main__":
    app.run( port=5000, debug=True)