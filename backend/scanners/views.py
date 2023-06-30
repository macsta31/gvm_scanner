import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from django.views.decorators.csrf import csrf_exempt

def get_scanners(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        scanners = gmp.get_scanners(filter_string="rows=42")
        scanners_soup = BeautifulSoup(scanners, 'lxml')

        scanner_tags = scanners_soup.find_all('scanner')

        id_dict = {}

        for scanner_tag in scanner_tags:
            id_attribute = scanner_tag.get("id")
            name_tag = scanner_tag.find_all("name")[1]
            if id_attribute and name_tag:
                name = name_tag.text.strip()
                if name:
                    id_dict[name] = id_attribute

        return JsonResponse(id_dict)
