from posixpath import dirname
from flask import Flask,jsonify,request,json
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
            for word in entities_list:
                areas = page.search_for(word)
                for area in areas:
                    if redact_type == "BlackOut":
                        page.add_redact_annot(area, fill=(0, 0, 0))
                    elif redact_type == "Vanishing":
                        page.add_redact_annot(area, fill=(1, 1, 1))
                    elif redact_type == "Blurring":
                        page.add_redact_annot(area, fill=(1, 1, 0))
                    elif redact_type=="CategoryReplacement":
                        page.add_redact_annot(area,fill=(1,1,1))
                        x, y, x2, y2 = area
                        rect_area.append((x + 4, y2 - 3)) 
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