# tests.py
from channels.testing import WebsocketCommunicator
from gvmapp.routing import application
import pytest
import json

@pytest.mark.asyncio
async def test_consumer():
    communicator = WebsocketCommunicator(application, 'ws/task_info/')
    connected, _ = await communicator.connect()
    assert connected

    # Test sending text
    await communicator.send_to(text_data=json.dumps({
        'message': 'hello'
    }))

    # Test receiving text
    response = await communicator.receive_from()
    response_data = json.loads(response)

    assert response_data['message'] == 'Your expected message'
    print(response_data['message'])

    # Close
    await communicator.disconnect()
