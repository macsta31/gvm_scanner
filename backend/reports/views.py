from base64 import b64decode, b64encode
import json
import re
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup
from lxml import etree
from django.views.decorators.csrf import csrf_exempt
from typing import Any, List, Dict
import logging

from lxml import etree
from typing import List, Dict, Any
import xml.etree.ElementTree as ET

def extract_reports(xml_string: str) -> List[Dict[str, Any]]:
    root = etree.fromstring(xml_string.encode('utf-8'))
    reports = root.xpath('//report[not(ancestor::report)]')
    return [walk(report) for report in reports]

def walk(node: etree._Element) -> Dict[str, Any]:
    info = {**node.attrib, **{"text": node.text.strip() if node.text else None}}
    for child in node:
        info[child.tag] = walk(child)
    return info

# Create your views here.
def get_reports(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        reports = gmp.get_reports(details=1, filter_id=None, filter_string="rows=42")
        reports_soup = BeautifulSoup(reports, 'lxml')


        return JsonResponse(extract_reports(reports_soup.prettify()), safe=False)
    
def extract_report(xml_string: str, report_id: str) -> List[Dict[str, Any]]:
    root = etree.fromstring(xml_string.encode('utf-8'))
    report = root.xpath(f'//report')
    if report:
        return walk(report[0])
    return {}
    
def get_report(request):
    report_id = request.GET.get('report_id')
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        pdf_report_format_id = "c402cc3e-b531-11e1-9163-406186ea4fc5"
        # report_format_id=pdf_report_format_id
        response = gmp.get_report(report_id=report_id, report_format_id=pdf_report_format_id, details=1, ignore_pagination=True, filter_string="levels=hmlg min_qod=0")
        response_soup = BeautifulSoup(response, 'lxml').prettify()
        long_string = ''
        match = re.search(r'</report_format>\s*(.*)', response_soup)
        if match:
            long_string = match.group(1)
            # print(long_string[-1000])
        else:
            print("No match found.")

        # # Parse the XML response and extract the encoded PDF data
        root = ET.fromstring(response_soup)

        # Find the report element
        report_element = root.find('report')
        encoded_data = ''
        if report_element is not None:
            # Get the base64 encoded data
            encoded_data = report_element.text

        # print(pdf_data.text)

        # print(pdf_data)

        # # The PDF data is base64 encoded, so we decode it
        # # pdf_bytes = b64decode(pdf_data)

        # # Now re-encode it to base64, but this time as a string
        # pdf_base64 = b64encode(pdf_bytes).decode('utf-8')

        return JsonResponse(long_string, safe=False)
    
def get_report_formats(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        reports = gmp.get_report_formats()
        reports_soup = BeautifulSoup(reports, 'lxml')


        return JsonResponse(reports_soup.prettify(), safe=False)