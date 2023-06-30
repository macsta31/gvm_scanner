import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup

from django.views.decorators.csrf import csrf_exempt


import xml.etree.ElementTree as ET
from typing import List, Dict, Any

def extract_results(xml_string: str) -> List[dict]:
    root = ET.fromstring(xml_string)
    results = root.findall('.//result')
    return [walk(result) for result in results]

def walk(node: ET.Element) -> dict:
    info = {**node.attrib, **{"text": node.text.strip() if node.text else None}}
    for child in node:
        info[child.tag] = walk(child)
    return info

# Create your views here.
def get_results(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        results = gmp.get_results(filter_string="rows=42")
        results_soup = BeautifulSoup(results, 'lxml')


        # return JsonResponse(extract_reports(reports_soup.prettify()), safe=False)
        return JsonResponse(extract_results(results_soup.prettify()), safe=False)