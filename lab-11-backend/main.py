# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

SOLR_URL = "http://localhost:8983/solr/jcg1/select"

@app.route('/search')
def search():
    query = request.args.get("q", "*:*")
    params = {
        "q": query,
        "wt": "json",
        "q.op": "OR",
        "rows": 10
    }
    solr_response = requests.get(SOLR_URL, params=params)
    print(solr_response.json(),"mss")
    return jsonify(solr_response.json())

if __name__ == "__main__":
    app.run(port=5000)
