import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
from lxml import etree
from django.views.decorators.csrf import csrf_exempt
from typing import Any, List, Dict

from lxml import etree
from typing import List, Dict, Any

def extract_scans(xml_string: str) -> List[Dict[str, Any]]:
    root = etree.fromstring(xml_string.encode('utf-8'))
    scans = root.xpath('//report[not(ancestor::scan)]')
    return [walk(scan) for scan in scans]

def walk(node: etree._Element) -> Dict[str, Any]:
    info = {**node.attrib, **{"text": node.text.strip() if node.text else None}}
    for child in node:
        info[child.tag] = walk(child)
    return info

# Create your views here.
def get_scans(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        scans = gmp.get_scans()
        scans_soup = BeautifulSoup(scans, 'lxml')


        # return JsonResponse(extract_reports(reports_soup.prettify()), safe=False)
        return JsonResponse(scans_soup.prettify(), safe=False)
    
def get_scan(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        scans = gmp.get_scans()
        scans_soup = BeautifulSoup(scans, 'lxml')

        scan_tags = scans_soup.find_all('scan')
        # print(reports_soup.prettify())

        id_dict = {}

        for scan_tag in scan_tags:
            id_attribute = scan_tag.get("id")
            name_tag = scan_tag.find_all("name")[1]
            if id_attribute and name_tag:
                name = name_tag.text.strip()
                if name:
                    id_dict[name] = id_attribute

        return JsonResponse(scans_soup.prettify(), safe=False)
