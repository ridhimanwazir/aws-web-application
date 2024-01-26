from flask import Flask, request, jsonify
import boto3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Initialize the SNS client
sns_client = boto3.client('sns', region_name='us-east-1') 

@app.route('/', methods=['POST'])
def send_message():
    data = request.get_json()
    new_task_title = data.get('task_title')

    topic_arn = 'arn:aws:sns:us-east-1:694522895640:task-manager-alerts'
    message = f'New task created: {new_task_title}'

    try:
        sns_client.publish(TopicArn=topic_arn, Message=message)
        return jsonify({'message': 'Message sent successfully'})
    except Exception as e:
        print(f'Error sending message: {str(e)}')
        return jsonify({'error': f'Error sending message: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
