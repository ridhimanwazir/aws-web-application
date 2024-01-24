import boto3
import uuid
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('TaskManager')

def send_message_to_python_backend(new_task_title):
    python_backend_url = 'http://54.242.33.69:5001/send-message'  # Update with the actual Python backend service URL

    try:
        response = requests.post(python_backend_url, json={'task_title': new_task_title})
        response.raise_for_status()
        print(response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error sending message to Python backend: {e}")

@app.route('/tasks', methods=['GET'])
def get_tasks():
    logging.info('GET /tasks')
    response = table.scan()
    tasks = response.get('Items', [])
    task_list = [{'id': task['id'], 'title': task['title']} for task in tasks]
    return jsonify({'tasks': task_list})

@app.route('/tasks', methods=['POST'])
def create_task():
    logging.info('POST /tasks')
    data = request.get_json()
    new_task = {
        'id': str(uuid.uuid4()),
        'title': data['title']
    }
    table.put_item(Item=new_task)
    send_message_to_python_backend(new_task['title'])

    return jsonify({'message': 'Task created successfully'}), 201

@app.route('/tasks/<string:task_id>', methods=['DELETE'])
def delete_task(task_id):
    logging.info(f'DELETE /tasks/{task_id}')
    table.delete_item(Key={'id': task_id})
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)
