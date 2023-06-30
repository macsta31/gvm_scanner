import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup

# Create your views here.
def get_configs(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        configs = gmp.get_scan_configs()
        configs_soup = BeautifulSoup(configs, 'lxml')

        config_tags = configs_soup.find_all('config')

        id_dict = {}

        for config_tag in config_tags:
            id_attribute = config_tag.get("id")
            name_tag = config_tag.find_all("name")[1]
            if id_attribute and name_tag:
                name = name_tag.text.strip()
                if name:
                    id_dict[name] = id_attribute

        return JsonResponse(id_dict)
    
def get_config(request):
    config_id = request.GET.get('config_id')
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        configs = gmp.get_scan_config(config_id=config_id)
        config_soup = BeautifulSoup(configs, 'lxml')
        return JsonResponse(config_soup.prettify() , safe=False)
    

# def create_config(request):
#     path = '/run/gvmd/gvmd.sock'
#     connection = UnixSocketConnection(path=path)

#     username = request.session.get('username')
#     password = request.session.get('password')
#     with Gmp(connection=connection) as gmp:
#         gmp.authenticate(username, password)
        
#         configs = gmp.get_scan_configs()
#         configs_soup = BeautifulSoup(configs, 'lxml')

#         config_tags = configs_soup.find_all('config')

#         id_dict = {}

#         for config_tag in config_tags:
#             id_attribute = config_tag.get("id")
#             name_tag = config_tag.find_all("name")[1]
#             if id_attribute and name_tag:
#                 name = name_tag.text.strip()
#                 if name:
#                     id_dict[name] = id_attribute

#         return JsonResponse(id_dict)
    
def create_config(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        # config = gmp.get_scan_config('daba56c8-73ec-11df-a475-002264764cea')
        new_config = gmp.create_scan_config(config_id='daba56c8-73ec-11df-a475-002264764cea', name='My config')
        print(new_config)

def modify_config(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        nvt_pref = ''
        try:
            
            # families = gmp.get_nvt_families()
            # families = [('Enable generic web application scanning', True, True)]
            config_id='47fef207-db1c-4257-9da8-cb994abefc9f'
            # response = gmp.modify_scan_config_set_nvt_selection(config_id, familu,  auto_add_new_families=True)
            # gmp.modify_scan_config_set_nvt_preference(config_id='47fef207-db1c-4257-9da8-cb994abefc9f', name='Report verbosity', nvt_oid='1.3.6.1.4.1.25623.1.0.12288', value='Verbose')
            # response1 = gmp.modify_scan_config_set_nvt_preference(config_id, name='Enable generic web application scanning',nvt_oid='1.3.6.1.4.1.25623.1.0.12288', value='Yes')
            # response2 = gmp.modify_scan_config_set_nvt_preference(config_id, name='Global variable settings',nvt_oid='1.3.6.1.4.1.25623.1.0.12288', value='yes')

            nvt_pref = gmp.get_nvt_preference(name='Global variable settings')

            nvt_soup = BeautifulSoup(nvt_pref, 'lxml')

            # print(response1)
            # print(response2)

        except Exception as e:
            print(str(e))


        return JsonResponse(nvt_pref, safe=False)
    
def create_filter(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
            
        configs = gmp.create_filter(name="no filter", filter_type='vuln', term='severity=High')
        configs_soup = BeautifulSoup(configs, 'lxml')

        # config_tags = configs_soup.find_all('config')

        # id_dict = {}

        # for config_tag in config_tags:
        #     id_attribute = config_tag.get("id")
        #     name_tag = config_tag.find_all("name")[1]
        #     if id_attribute and name_tag:
        #         name = name_tag.text.strip()
        #         if name:
        #             id_dict[name] = id_attribute

        return JsonResponse(configs_soup.prettify(), safe=False)
    

def get_filters(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
            
        configs = gmp.get_filters()
        configs_soup = BeautifulSoup(configs, 'lxml')

        # config_tags = configs_soup.find_all('config')

        # id_dict = {}

        # for config_tag in config_tags:
        #     id_attribute = config_tag.get("id")
        #     name_tag = config_tag.find_all("name")[1]
        #     if id_attribute and name_tag:
        #         name = name_tag.text.strip()
        #         if name:
        #             id_dict[name] = id_attribute

        return JsonResponse(configs_soup.prettify(), safe=False)
