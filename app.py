"""
all flask apis will go in here
"""

from flask import Flask, jsonify, request, make_response
from extract_function import extract_functions_with_body
from extract_graph import build_function_dependency_graph_from_file
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app, origins=["https://cs409-frontend.vercel.app/", "http://localhost:3000"])

load_dotenv(override=True)
print("Loaded API Key:", os.getenv("OPENAI_API_KEY"))
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/')
def home():
    return "cs409 flask hehe"

#input is "Functions":[]
#{"Body": ...., "Header": ...}
@app.route('/get-summaries', methods=['POST'])
def get_summaries():
    try:
        data = request.get_json()
        summaries = []

        for function in data["Functions"]:
            body = function.get("Body", "")
            header = function.get("Header", "")

            prompt = f"Given this Function signature: {header}\n and Function body:\n{body}\n\nSummarize what this function does in 1-2 sentences:"

            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system","content":"Give me a concise summary of what each function is doing (No introductory phrases like here you go or heres a summary, just give me the straight up summary)."},
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
                max_tokens=300
            )

            fed = response['choices'][0]['message']['content']
            summaries.append(fed)
    
        print("successfully got summaries:")
        print(summaries)
        print("......................................")
        return jsonify({"summaries": summaries}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#similar format as above, but gets feedback for each function in optimization tab
@app.route('/get-feedback', methods=['POST'])
def get_feedback():
    try:
        data = request.get_json()
        feedback = []

        for function in data["Functions"]:
            body = function.get("Body", "")
            header = function.get("Header", "")

            prompt = f"Given this Function signature: {header}\n and Function body:\n{body}\n\n Tell me how you would optimize this function for optimal memory/time performance."

            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system","content":"You are helping somebody optimize their C code in terms of performance, memory usage, and syntax. Use dashes as bullet points (please add new lines since this will be going into html later) and green/red circles (with good/green points first, then red) and aanlyze these functions based on the below. Just give me feedback, nothing like certainly heres your feedback. Please make every function feedback the same format, and no code examples just suggestions."},
                    {"role": "user", "content": [{"type": "text", "text": prompt}]}
                ],
                max_tokens=300
            )
            fed = response['choices'][0]['message']['content']

            feedback.append(fed)

        print("successfully got feedbacks:")
        print(feedback)
        print("......................................")
        return jsonify({"feedbacks": feedback}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/extract-functions', methods=['POST'])
def extract_functions():
    try:
        c_code = request.json.get('c_code', '')
        if not c_code:
            return jsonify({"error": "No C code provided"}), 400

        functions = extract_functions_with_body(c_code)

        return jsonify({"Functions": functions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


"""
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Keep it for general setup

@app.route('/upload-c-file', methods=['POST'])
def upload_c_file():
    response = make_response(jsonify({"message": "File uploaded successfully!"}), 200)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

if __name__ == '__main__':
    app.run()
"""
@app.route('/upload-c-file', methods=['POST'])
def upload_c_file():
    try:
        uploaded_file = request.files.get('file')
        if not uploaded_file:
            return jsonify({"error": "No file uploaded"}), 400

        c_code = uploaded_file.read().decode('utf-8')

        functions = extract_functions_with_body(c_code)

        response = make_response(jsonify({"Functions": functions}), 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    
    except Exception as e:
        response = make_response(jsonify({"error": str(e)}), 500)
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

@app.route('/graph-dependencies', methods=['POST'])
def graph_dependencies():
    try:
        # Parse the JSON body
        data = request.get_json()
        if not data or 'value' not in data:
            return jsonify({"error": "No code provided"}), 400

        c_code = data['value']  # Retrieve the 'codes' field from JSON

        # Process the code to build the dependency graph
        dependency_graph = build_function_dependency_graph_from_file(c_code)

        return jsonify(dependency_graph), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
