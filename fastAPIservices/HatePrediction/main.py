from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from typing import Dict

# Initialize FastAPI app
app = FastAPI(title="Toxicity Detection API", description="API to detect hate/toxicity in text using unitary/unbiased-toxic-roberta")

# Load pretrained hate/toxicity detection model
classifier = pipeline("text-classification", model="unitary/unbiased-toxic-roberta", top_k=None)

THRESHOLD = 0.6  # 60%

# Pydantic model for request body
class TextInput(BaseModel):
    text: str

def check_hate(text: str) -> Dict:
    # Get model predictions
    results = classifier(text)[0]  # List of dicts with label and score
    
    # Define toxic labels as per the model
    toxic_labels = {"toxic", "insult", "obscene", "identity_attack", "threat", "sexual_explicit"}
    
    # Initialize variables
    flagged = False
    prediction = "✅ Clean"
    max_toxic_score = 0.0
    max_toxic_label = "non_toxic"
    
    # Check all labels for toxicity
    for result in results:
        label = result['label'].lower()
        score = result['score']
        if label in toxic_labels and score >= THRESHOLD:
            flagged = True
            prediction = "⚠️ Hate/Toxic"
            if score > max_toxic_score:
                max_toxic_score = score
                max_toxic_label = label
    
    # If no toxic labels are found, use the highest-scoring label
    if not flagged:
        best = max(results, key=lambda x: x['score'])
        max_toxic_label = best['label'].lower()
        max_toxic_score = best['score']
    
    return {
        "text": text,
        "prediction": prediction,
        "confidence": round(max_toxic_score, 2),
        "flagged": flagged,
        "label": max_toxic_label
    }

# API endpoint to check toxicity
@app.post("/check-toxicity", response_model=Dict)
async def check_toxicity(input: TextInput):
    try:
        if not input.text.strip():
            raise HTTPException(status_code=400, detail="Text input cannot be empty")
        result = check_hate(input.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing text: {str(e)}")

# Root endpoint for API welcome message
@app.get("/")
async def root():
    return {"message": "Welcome to the Toxicity Detection API. Use POST /check-toxicity with a JSON body containing 'text'."}