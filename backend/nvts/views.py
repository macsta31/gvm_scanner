import json
from django.shortcuts import render
from django.http import JsonResponse
import sys
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from bs4 import BeautifulSoup

# Create your views here.
def get_nvts(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        
        nvts = gmp.get_cves(filter_string="rows=300000")
        nvts_soup = BeautifulSoup(nvts, 'lxml')
        return JsonResponse(nvts_soup.prettify(), safe=False)
        # nvt_tags = nvts_soup.find_all('nvt')

        # dict = {}

        # for nvt_tag in nvt_tags:
        #     print(nvt_tag)
        #     id_attribute = nvt_tag.get("id")
        #     descr_tag = nvt_tag.find_all("description")
        #     if id_attribute and descr_tag:
        #         name = descr_tag.text.strip()
        #         if name:
        #             dict[name] = id_attribute
        #     dict[nvt_tag.get("id")] = nvt_tag.get

        # return JsonResponse(dict)