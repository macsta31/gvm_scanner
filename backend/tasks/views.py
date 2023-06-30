import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
from gvm.protocols.gmpv224 import AlertCondition
from gvm.protocols.gmpv224 import AlertEvent
from gvm.protocols.gmpv224 import AlertMethod
from gvm.xml import pretty_print

import time
import xml.etree.ElementTree as ET
from django.views.decorators.csrf import csrf_exempt
from typing import Any, List

@csrf_exempt
def create_task(request):
    if request.method != 'POST':
        return JsonResponse({'error': "Only POST method allowed"}, status=405)
    

    try:
        data = json.loads(request.body)
        print(data)
        taskName = data.get('name')
        target = data.get('target')
        config = ''
        try:
            config = data.get('config')
        except Exception:
            print('no config')
        
        scanner = data.get('scanner') 

        print(config)

        path = '/run/gvmd/gvmd.sock'
        connection = UnixSocketConnection(path=path)

        username = request.session.get('username')
        password = request.session.get('password')
        # print(1)
        with Gmp(connection=connection) as gmp:
            # print(2)
            # target_id = request.GET.get('target_id')


            gmp.authenticate(username, password)
            # print(3)
            # try:
            #     gmp.create_alert(name='Task finished', condition=AlertCondition.ALWAYS, event=AlertEvent.TASK_RUN_STATUS_CHANGED, event_data={'status': 'Done'}, method=AlertMethod.EMAIL, method_data={'to': 'mackstathis@gmail.com', 'notice': '2', 'message': 'Task Complete', 'subject': '[GVM] Task Completed', 'report_format': "c402cc3e-b531-11e1-9163-406186ea4fc5"})
            #     print(gmp.get_alerts())
            #     return

            # except Exception as e:
            #     print(str(e))
        
            # Get Scanner id
            try:
                result = ''
                if config != '':
                    # print(9)
                    result = gmp.create_task(name=taskName, target_id=target, scanner_id=scanner, config_id=config, alert_ids=['6d6bcdf9-74a8-495a-913d-4c382bcb85e6'])
                else:
                    # print(10)
                    result = gmp.create_task(name=taskName, target_id=target, scanner_id=scanner, config_id='aba56c8-73ec-11df-a475-002264764cea', alert_ids=['6d6bcdf9-74a8-495a-913d-4c382bcb85e6'])
                # print(result)
                task_soup = BeautifulSoup(result, 'lxml')
                # print(5)
                task_id = task_soup.find('create_task_response')['id']
                # print(6)
                return JsonResponse({'message': task_id})
            except Exception as e:
                print(7)
                return JsonResponse({'error': str(e)}, status=500)
            
    except json.JSONDecodeError:
            print(8)
            return JsonResponse({'error': "Invalid JSON"}, status=400)
    
    except Exception as e:
            print(9)
            return JsonResponse({'error': f"An error occured: {str(e)}"}, status=500)



def extract_task_info(xml_string):
    tasks = []

    # Parse the XML string
    root = ET.fromstring(xml_string)

    # Find all task elements
    task_elements = root.findall(".//task")

    # Iterate over each task element
    for task_element in task_elements:
        task_info = {}

        # Extract task attributes and remove whitespace
        task_info["id"] = task_element.attrib.get("id").strip()

        # Extract task data recursively
        extract_task_data(task_element, task_info)

        # Add task dictionary to the list
        tasks.append(task_info)

    return tasks


def extract_task_data(element, task_info):
    # Iterate over child elements
    for child_element in element:
        tag = child_element.tag
        text = child_element.text.strip() if child_element.text else ""

        # Handle nested elements
        if child_element:
            nested_data = {}
            extract_task_data(child_element, nested_data)
            task_info[tag] = nested_data
        else:
            task_info[tag] = text

def extract_tasks(xml_string: str) -> List[dict]:
    root = ET.fromstring(xml_string)
    tasks = root.findall('.//task')
    return [walk(task) for task in tasks]

def walk(node: ET.Element) -> dict:
    info = {**node.attrib, **{"text": node.text.strip() if node.text else None}}
    for child in node:
        info[child.tag] = walk(child)
    return info


    
def get_tasks(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        tasks = gmp.get_tasks(filter_string="rows=42")
        tasks_soup = BeautifulSoup(tasks, 'lxml')

        return JsonResponse(extract_tasks(tasks_soup.prettify()), safe=False)
    
def get_task(request):
    task_id = request.GET.get('task_id')
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        tasks = gmp.get_task(task_id=task_id)
        tasks_soup = BeautifulSoup(tasks, 'lxml')

        tasks_dict = extract_task_info(tasks_soup.prettify())

        return JsonResponse(tasks_dict, safe=False)

def delete_task(request):
    task_id = request.GET.get('task_id')

    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)

        response = gmp.delete_task(task_id)
        return JsonResponse({'delete_response': response})
    
def start_task(request):
    task_id = request.GET.get('task_id')
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)

        response = gmp.start_task(task_id)
        return JsonResponse({'response': response})
    
def task_status(request):
    task_id = request.GET.get('task_id')

    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)

        response = gmp.get_task(task_id)
        response_soup = BeautifulSoup(response, 'lxml')
        status = response_soup.find('progress').text
        return JsonResponse({'status': status})
    
def stop_task(request):
    task_id = request.GET.get('task_id')

    if not task_id:
        return JsonResponse({'status': 'task id not provided'})

    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        print(task_id)
        try:

            response = gmp.stop_task(task_id)
        except Exception as e:
            return JsonResponse({'status': str(e)})
        
        response_soup = BeautifulSoup(response, 'lxml')
        return JsonResponse({'status': response_soup.prettify()}, safe=False)

def random(request):
    return render(request,'my_template.html',context={'text':"hello world"})