import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.exceptions import StopConsumer
from random import randint
from time import sleep
import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
import time
import xml.etree.ElementTree as ET
from django.views.decorators.csrf import csrf_exempt


class PracticeConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        # when websocket connects
        print("connected", event)
        await self.send({
            "type": "websocket.accept",
        })

        stop_event = asyncio.Event()  # Create an event to control the loop

        async def send_progress():
            while not stop_event.is_set():
                path = '/run/gvmd/gvmd.sock'
                connection = UnixSocketConnection(path=path)

                username = self.scope['session'].get('username')
                password = self.scope['session'].get('password')

                with Gmp(connection=connection) as gmp:
                    gmp.authenticate(username, password)
                    progress = []
                    response = gmp.get_tasks()
                    tasks_soup = BeautifulSoup(response, 'lxml')
                    # print(tasks_soup.prettify())
                    tasks = tasks_soup.find_all('task')
                    for i, task in enumerate(tasks):
                        id = task['id']
                        status = task.find('status').text
                        progress_ = task.find('progress').text
                        progress.append({'id': id, 'progress': progress_, 'status': status})

                    await self.send({
                        "type": "websocket.send",
                        "text": json.dumps({"data": progress})
                    })

                    try:
                        await asyncio.sleep(3)
                    except asyncio.CancelledError:
                        break

        # Start the send_progress task in the background
        self.send_progress_task = asyncio.create_task(send_progress())

        # # Start the send_progress task in the background
        # asyncio.ensure_future(send_progress())

        try:
            # Wait for the WebSocket to close
            await self.channel_layer.receive('websocket.disconnect')
        finally:
            # Set the stop event to stop the loop
            stop_event.set()






    async def websocket_receive(self,event):
        # when messages is received from websocket
        print("receive",event)
        


        # asyncio.sleep(1)

        # await self.send({"type": "websocket.send",
        #                  "text":str(randint(0,100))})




    async def websocket_disconnect(self, event):
        print("disconnected", event)
        
        # Cancel the send_progress task
        if self.send_progress_task:
            self.send_progress_task.cancel()

        raise StopConsumer