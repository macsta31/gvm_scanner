import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from django.views.decorators.csrf import csrf_exempt
from gvm.protocols.gmpv224 import AliveTest


# Create your views here.
@csrf_exempt
def create_target(request):
    if request.method != 'POST':
        return JsonResponse({'error': "Only POST method allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        targetName = data.get('name')
        portList = data.get('portList')
        hosts = data.get('hosts')

        path = '/run/gvmd/gvmd.sock'
        connection = UnixSocketConnection(path=path)

        username = request.session.get('username')
        password = request.session.get('password')
        print(username, password)

        with Gmp(connection=connection) as gmp:
            print(1)
            response = gmp.authenticate(username, password)
            print(response)
            print(2)

            try:
                print(3)
                result = gmp.create_target(name=targetName, hosts=hosts, port_list_id=portList, alive_test=AliveTest.CONSIDER_ALIVE)
                print(result)
                target_soup = BeautifulSoup(result, 'lxml')
                target_id = target_soup.find('create_target_response')['id']
                return JsonResponse({"message": target_id})
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)

    except json.JSONDecodeError:
        return JsonResponse({'error': "Invalid JSON"}, status=400)
    
    except Exception as e:
        return JsonResponse({'error': f"An error occurred: {str(e)}"}, status=500)




def extract_targets(xml_string):
    soup = BeautifulSoup(xml_string, 'xml')
    # print(soup.prettify())
    targets = []

    target_tags = soup.find_all('target')
    for target_tag in target_tags:
        target = {
            'id': target_tag.get('id'),
            'owner': target_tag.find('owner').find('name').text.strip(),
            'name': target_tag.find_all('name')[1].text.strip(),
            'comment': target_tag.find('comment').text.strip(),
            'creation_time': target_tag.find('creation_time').text.strip(),
            'modification_time': target_tag.find('modification_time').text.strip(),
            'writable': target_tag.find('writable').text.strip(),
            'in_use': target_tag.find('in_use').text.strip(),
            'permissions': target_tag.find('permissions').find('permission').find('name').text.strip(),
            'hosts': target_tag.find('hosts').text.strip(),
            'exclude_hosts': target_tag.find('exclude_hosts').text.strip(),
            'max_hosts': target_tag.find('max_hosts').text.strip(),
            'port_list': {
                'id': target_tag.find('port_list').get('id'),
                'name': target_tag.find('port_list').find('name').text.strip(),
                'trash': target_tag.find('port_list').find('trash').text.strip(),
            },
            'ssh_credential': {
                'id': target_tag.find('ssh_credential').get('id'),
                'name': target_tag.find('ssh_credential').find('name').text.strip(),
                'port': target_tag.find('ssh_credential').find('port').text.strip(),
                'trash': target_tag.find('ssh_credential').find('trash').text.strip(),
            },
            'smb_credential': {
                'id': target_tag.find('smb_credential').get('id'),
                'name': target_tag.find('smb_credential').find('name').text.strip(),
                'trash': target_tag.find('smb_credential').find('trash').text.strip(),
            },
            'esxi_credential': {
                'id': target_tag.find('esxi_credential').get('id'),
                'name': target_tag.find('esxi_credential').find('name').text.strip(),
                'trash': target_tag.find('esxi_credential').find('trash').text.strip(),
            },
            'snmp_credential': {
                'id': target_tag.find('snmp_credential').get('id'),
                'name': target_tag.find('snmp_credential').find('name').text.strip(),
                'trash': target_tag.find('snmp_credential').find('trash').text.strip(),
            },
            'ssh_elevate_credential': {
                'id': target_tag.find('ssh_elevate_credential').get('id'),
                'name': target_tag.find('ssh_elevate_credential').find('name').text.strip(),
                'trash': target_tag.find('ssh_elevate_credential').find('trash').text.strip(),
            },
            'reverse_lookup_only': target_tag.find('reverse_lookup_only').text.strip(),
            'reverse_lookup_unify': target_tag.find('reverse_lookup_unify').text.strip(),
            'alive_tests': target_tag.find('alive_tests').text.strip(),
            'allow_simultaneous_ips': target_tag.find('allow_simultaneous_ips').text.strip(),
        }

        targets.append(target)

    return targets

    
def get_targets(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        targets = gmp.get_targets(filter_string="rows=42")
        targets_soup = BeautifulSoup(targets, 'lxml')
        info_dict_list = extract_targets(targets_soup.prettify())

        # id_dict = {}

        # for target_tag in target_tags:
        #     id_attribute = target_tag.get("id")
        #     name_tag = target_tag.find_all("name")[1]
        #     if id_attribute and name_tag:
        #         name = name_tag.text.strip()
        #         if name:
        #             id_dict[name] = id_attribute

        return JsonResponse(info_dict_list, safe=False)
# def get_targets(request):
#     username = request.session.get('username')
#     password = request.session.get('password')

#     return JsonResponse({
#         'username': username,
#         'password': password,
#     })

    
def delete_target(request):

    target_id = request.GET.get('target_id')

    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)

        response = gmp.delete_target(target_id)
        return JsonResponse({'delete_response': response})
    
def get_target(request):
    target_id = request.GET.get('target_id')
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        targets = gmp.get_target(target_id)
        targets_soup = BeautifulSoup(targets, 'lxml')
        info_dict_list = extract_targets(targets_soup.prettify())

        # id_dict = {}

        # for target_tag in target_tags:
        #     id_attribute = target_tag.get("id")
        #     name_tag = target_tag.find_all("name")[1]
        #     if id_attribute and name_tag:
        #         name = name_tag.text.strip()
        #         if name:
        #             id_dict[name] = id_attribute

        return JsonResponse(info_dict_list, safe=False)