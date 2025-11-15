from gliner import GLiNER

model = GLiNER.from_pretrained("knowledgator/gliner-multitask-large-v0.5")

text = """
ABSTRACT 
ON 
MINDSCRIBE: AN EGG BASED BRAIN-TO-TEXT SYSTEM FOR 
DECODING NEURAL SIGNALS USING DEEP LEARNING 
Submitted to 
DEPARTMENT 
OF 
COMPUTER SCIENCE AND ENGINEERING 
By 
Chivukula Kamal Nayan 
Gaddam Sai Shashi Samanvith Reddy 
Gorjana Mandala Aravind  
Under the guidance 
Of 
245322733140 
245322733142 
245322733147 
S. MEGHANA 
ASSISTANT PROFESSOR, DEPARTMENT OF CSE 
DEPARTMENT OF CSE 
NEIL GOGTE INSTITUTE OF TECHNOLOGY 
Kachavanisingaram Village, Hyderabad, Telangana, 500058. 
2025-2026
"""

labels = ["names", "years", "numbers", "position", "places", "organizations","dates"]

entities = model.predict_entities(text, labels)

for entity in entities:
    print(entity["text"], "=>", entity["label"])
