from bs4 import BeautifulSoup
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import logout
from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from django.views.decorators.csrf import csrf_exempt
from gvm.protocols.gmpv224 import CredentialType
import json

# def authenticate(request):
#     # Perform authentication and retrieve the username and password
#     username = 'admin'
#     password = 'd268db17-a541-474e-93dd-6066926d9388'

#     # Store the authentication credentials in the session
#     request.session['username'] = username
#     request.session['password'] = password

#     return JsonResponse({'message': 'Authenticated successfully', 'sessionid': request.session.session_key})
@csrf_exempt
def authenticate(request):
    if request.method != 'POST':
        return JsonResponse({'error': "Only POST method allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        path = '/run/gvmd/gvmd.sock'
        connection = UnixSocketConnection(path=path)

        with Gmp(connection=connection) as gmp:
            response = gmp.authenticate(username, password)
            responsesoup = BeautifulSoup(response, 'lxml')
            # print(responsesoup.prettify())
            response = BeautifulSoup(response).find('authenticate_response')['status_text']
            if response == 'Authentication failed':
                return JsonResponse({'message': 'Authentication failed'}, status=403)
            request.session['username'] = username
            request.session['password'] = password
            return JsonResponse({
                'message': 'Authenticated successfully', 
                'sessionid': request.session.session_key
            })
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def new_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': "Only POST method allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        path = '/run/gvmd/gvmd.sock'
        connection = UnixSocketConnection(path=path)

        with Gmp(connection=connection) as gmp:
            gmp.authenticate('admin', 'd268db17-a541-474e-93dd-6066926d9388')
            try:
                response = gmp.create_user(name=username, password=password, role_ids=['8d453140-b74d-11e2-b0be-406186ea4fc5'])
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
            # response = gmp.create_credential(name=username, credential_type=CredentialType.USERNAME_PASSWORD, login=username, password=password, role_ids=['8d453140-b74d-11e2-b0be-406186ea4fc5'])
            return JsonResponse({
                'message': 'Account created Succesfully', 
                'sessionid': request.session.session_key
            })
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
        
def get_users(request):
    path = '/run/gvmd/gvmd.sock'
    connection = UnixSocketConnection(path=path)

    username = request.session.get('username')
    password = request.session.get('password')
    with Gmp(connection=connection) as gmp:
        gmp.authenticate(username, password)
        response = gmp.get_users()
        return JsonResponse(response, safe=False)

def logout_view(request):
    logout(request)
    # request.session['username'] = ''
    # request.session['password'] = ''

    return JsonResponse({'message': 'Logged out successfully'})

