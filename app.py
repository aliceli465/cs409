"""
all flask apis will go in here
"""

from flask import Flask, request, jsonify
from extract_function import extract_functions_with_body

app = Flask(__name__)


@app.route('/')
def home():
    return "hello world"

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


@app.route('/upload-c-file', methods=['POST'])
def upload_c_file():
    try:
        uploaded_file = request.files.get('file')
        if not uploaded_file:
            return jsonify({"error": "No file uploaded"}), 400

        c_code = uploaded_file.read().decode('utf-8')

        functions = extract_functions_with_body(c_code)

        return jsonify({"Functions": functions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)