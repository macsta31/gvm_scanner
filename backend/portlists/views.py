import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup

# Create your views here.
def get_portlists(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        portlists = gmp.get_port_lists()
        portlists_soup = BeautifulSoup(portlists, 'lxml')

        portlist_tags = portlists_soup.find_all('port_list')

        id_dict = {}

        for portlist_tag in portlist_tags:
            id_attribute = portlist_tag.get("id")
            name_tag = portlist_tag.find_all("name")[1]
            if id_attribute and name_tag:
                name = name_tag.text.strip()
                if name:
                    id_dict[name] = id_attribute

        return JsonResponse(id_dict)