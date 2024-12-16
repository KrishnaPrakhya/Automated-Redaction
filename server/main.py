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
from tensorflow.keras.models import load_model
import tensorflow as tf
import os
import requests
import cv2
app=Flask(__name__)
CORS(app)
def dice_coefficient(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    numerator = 2 * tf.reduce_sum(y_true * y_pred)
    denominator = tf.reduce_sum(y_true + y_pred)
    return numerator / (denominator + tf.keras.backend.epsilon())
model_unet = load_model('./model_at_epoch_cheq.keras', custom_objects={'dice_coefficient': dice_coefficient}, compile=False)
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



@app.route('https://8769-34-83-21-181.ngrok-free.app',methods=['POST'])
def predict():
    data = request.json
    # Example: Assuming input image is sent as a list
    input_image = np.array(data['image']).reshape(1, 512, 512, 1)
    prediction = model.predict(input_image)
    return jsonify({'prediction': prediction.tolist()})


@app.route('/api/unet', methods=['POST'])
def unetModel():
    import numpy as np

    def load_image(paths):
        original_sizes = []
        image_list = np.zeros((len(paths), 512, 512, 1))
        
        for i, fig in enumerate(paths):
            image = cv2.imread(fig, 0)
            h, w = image.shape
            original_sizes.append((h, w))
            
            ratio = min(512 / w, 512 / h)
            image = cv2.resize(image, (int(w * ratio), int(h * ratio)), interpolation=cv2.INTER_CUBIC)
            img_h, img_w = image.shape
            
            pad_h = 512 - img_h
            pad_w = 512 - img_w
            pad_top = pad_h // 2
            pad_bottom = pad_h - pad_top
            pad_left = pad_w // 2
            pad_right = pad_w - pad_left
            image = np.pad(image, pad_width=((pad_top, pad_bottom), (pad_left, pad_right)), mode='constant', constant_values=255)
            
            image = image / 255.0
            image = image.reshape(512, 512, 1)
            image_list[i] = image
        
        return image_list, original_sizes

    try:
        image_path ="./resme.jpeg"
        if not image_path:
            return jsonify({"error": "Image path not provided"}), 400

        original_image = cv2.imread(image_path)
        if original_image is None:
            return jsonify({"error": "Invalid image path"}), 400

        original_height, original_width = original_image.shape[:2]
        img, _ = load_image([image_path])

        predicted_mask = model_unet.predict(img).squeeze()  
        binary_mask = (predicted_mask > 0.5).astype(np.uint8)

        resized_mask = cv2.resize(binary_mask, (original_width, original_height), interpolation=cv2.INTER_LINEAR)

        redacted_image = original_image.copy()
        redacted_image[resized_mask == 1] = (0, 0, 0)  

        output_dir = "output"
        os.makedirs(output_dir, exist_ok=True)
        redacted_image_path = os.path.join(output_dir, "redacted_image.jpg")
        mask_path = os.path.join(output_dir, "mask.png")

        cv2.imwrite(redacted_image_path, redacted_image)
        cv2.imwrite(mask_path, resized_mask * 255) 

        return jsonify({
            "message": "Redaction completed successfully",
            "redacted_image_path": redacted_image_path,
            "mask_path": mask_path
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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