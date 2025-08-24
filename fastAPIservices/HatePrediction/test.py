import requests

# API endpoint
url = "https://agentsay-hateprediction.hf.space/check-toxicity"

# Example texts to test
texts = [
    "I hate you!",
    "You are wonderful",
    "You are a shitbag",
    "Let's grab dinner tonight"
]

for text in texts:
    payload = {"text": text}
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        print(f"📝 {text}")
        print("🔮 Prediction:", response.json()["prediction"])
        print("🤖 Label:", response.json()["label"])
        print("📊 Confidence:", response.json()["confidence"])
        print("🚩 Flagged:", response.json()["flagged"])
        print("-" * 50)
    else:
        print(f"Error {response.status_code}: {response.text}")
