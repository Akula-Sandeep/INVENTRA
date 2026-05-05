import urllib.request
import urllib.parse
import json
from urllib.error import HTTPError

login_url = 'http://127.0.0.1:8000/login'
login_data = urllib.parse.urlencode({'username': 'testuser', 'password': 'password123'}).encode()
req = urllib.request.Request(login_url, data=login_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
try:
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read())
    token = data['access_token']
    print('LOGIN OK', token[:20] + '...')
    product_url = 'http://127.0.0.1:8000/products'
    product_data = json.dumps({'name': 'X', 'description': 'Y', 'price': 10, 'quantity': 1}).encode()
    req2 = urllib.request.Request(product_url, data=product_data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}, method='POST')
    resp2 = urllib.request.urlopen(req2)
    print('POST OK', resp2.read().decode())
except HTTPError as e:
    print('HTTPERR', e.code, e.reason)
    try:
        print(e.read().decode())
    except Exception:
        pass
except Exception as e:
    print('ERR', e)
