import os
import re
import json
import hashlib
import requests
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .device_catalog_data import DEVICE_TYPES, DEVICE_CATALOG, find_device_by_tac

def validate_imei_luhn(imei):
    if not imei or not isinstance(imei, str):
        return False
    clean = imei.strip()
    if not re.match(r'^\d{15}$', clean):
        return False

    total = 0
    for i in range(15):
        digit = int(clean[i])
        if i % 2 == 1:
            digit *= 2
            if digit > 9:
                digit -= 9
        total += digit
    return total % 10 == 0

def compute_imei_hash(imei):
    if not imei:
        return ''
    return hashlib.sha256(imei.strip().encode('utf-8')).hexdigest()

def mask_imei(imei):
    if not imei:
        return ''
    clean = imei.strip()
    if len(clean) == 15:
        return f"••••••••••••{clean[-4:]}"
    if len(clean) > 4:
        return '••••' * ((len(clean) - 4) // 4) + clean[-4:]
    return clean

class DeviceDatabaseService:
    def __init__(self):
        self.external_api_key = os.environ.get('DEVICE_DB_API_KEY') or os.environ.get('GSMA_TAC_API_KEY')
        self.external_api_url = os.environ.get('DEVICE_DB_API_URL')

    def search_brands(self, device_type=None):
        catalog = DEVICE_CATALOG
        if device_type and device_type.lower() != 'all':
            catalog = [d for d in catalog if d.get('deviceType', '').lower() == device_type.lower()]
        
        brand_set = {d.get('brand') for d in catalog if d.get('brand')}
        return sorted(list(brand_set))

    def search_models(self, device_type=None, brand=None, query=None):
        results = DEVICE_CATALOG

        if device_type and device_type.lower() != 'all':
            results = [d for d in results if d.get('deviceType', '').lower() == device_type.lower()]

        if brand and brand.lower() != 'all':
            results = [d for d in results if d.get('brand', '').lower() == brand.lower()]

        if query and query.strip():
            q = query.strip().lower()
            filtered = []
            for d in results:
                m = d.get('model', '').lower()
                b = d.get('brand', '').lower()
                mn = d.get('modelNumber', '').lower()
                bm = f"{b} {m}"
                if q in m or q in b or q in mn or q in bm:
                    filtered.append(d)
            results = filtered

        return results

    def get_device_details(self, device_id):
        if not device_id:
            return None
        for d in DEVICE_CATALOG:
            if d.get('id') == device_id:
                return d
        return None

    def get_device_by_imei(self, raw_imei):
        if not raw_imei or not isinstance(raw_imei, str):
            return {
                'valid': False,
                'luhnValid': False,
                'message': 'IMEI is required and must be a 15-digit string.'
            }

        imei = raw_imei.strip()
        is_15_digits = bool(re.match(r'^\d{15}$', imei))

        if not is_15_digits:
            return {
                'valid': False,
                'luhnValid': False,
                'imei': imei,
                'message': 'Invalid IMEI. An IMEI number must contain exactly 15 numeric digits.'
            }

        luhn_valid = validate_imei_luhn(imei)
        tac = imei[:8]
        masked = mask_imei(imei)
        imei_hash = compute_imei_hash(imei)

        # 1. Try external provider if API key configured
        if self.external_api_key and self.external_api_url:
            try:
                response = requests.get(
                    f"{self.external_api_url}/v1/lookup?imei={imei}",
                    headers={
                        'Authorization': f"Bearer {self.external_api_key}",
                        'Accept': 'application/json'
                    },
                    timeout=5
                )
                if response.status_code == 200:
                    data = response.json()
                    if data and data.get('brand') and data.get('model'):
                        import time
                        return {
                            'valid': True,
                            'luhnValid': luhn_valid,
                            'imei': imei,
                            'maskedImei': masked,
                            'imeiHash': imei_hash,
                            'tac': tac,
                            'identified': True,
                            'device': {
                                'id': f"ext-{int(time.time() * 1000)}",
                                'deviceType': data.get('deviceType', 'Smartphone'),
                                'brand': data.get('brand'),
                                'model': data.get('model'),
                                'modelNumber': data.get('modelNumber', ''),
                                'releaseYear': data.get('releaseYear', 2024),
                                'specifications': data.get('specifications', {}),
                                'repairabilityScore': data.get('repairabilityScore', 8.0),
                                'estimatedResaleMin': data.get('estimatedResaleMin', 25000),
                                'estimatedResaleMax': data.get('estimatedResaleMax', 35000),
                                'source': 'EXTERNAL_PROVIDER'
                            }
                        }
            except Exception as e:
                print(f"[DeviceDatabaseService] External lookup failed, falling back to local catalog: {e}")

        # 2. Query local TAC database
        local_device = find_device_by_tac(tac)
        if local_device:
            return {
                'valid': True,
                'luhnValid': luhn_valid,
                'imei': imei,
                'maskedImei': masked,
                'imeiHash': imei_hash,
                'tac': tac,
                'identified': True,
                'device': local_device,
                'source': 'GSMA_TAC_LOCAL_CATALOG'
            }

        # 3. Fallback when TAC cannot be matched
        return {
            'valid': True,
            'luhnValid': luhn_valid,
            'imei': imei,
            'maskedImei': masked,
            'imeiHash': imei_hash,
            'tac': tac,
            'identified': False,
            'device': None,
            'message': 'Device information could not be confirmed from this IMEI.'
        }

service_instance = DeviceDatabaseService()

def send_json(data, status=200):
    response = JsonResponse(data, status=status)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@csrf_exempt
def handle_device_api_request(request, path=''):
    if request.method == 'OPTIONS':
        response = HttpResponse(status=204)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

    normalized_path = '/' + path.strip('/') if path.strip('/') else '/'

    try:
        # 1. GET /types
        if (normalized_path == '/types' or normalized_path == '/') and request.method == 'GET':
            return send_json({'types': DEVICE_TYPES})

        # 2. GET /brands
        if normalized_path == '/brands' and request.method == 'GET':
            device_type = request.GET.get('type')
            brands = service_instance.search_brands(device_type)
            return send_json({'brands': brands})

        # 3. GET /models
        if normalized_path == '/models' and request.method == 'GET':
            device_type = request.GET.get('type')
            brand = request.GET.get('brand')
            query = request.GET.get('q')
            models = service_instance.search_models(device_type, brand, query)
            return send_json({'models': models, 'count': len(models)})

        # 4. GET /details
        if normalized_path == '/details' and request.method == 'GET':
            device_id = request.GET.get('id')
            if not device_id:
                return send_json({'error': 'Device ID is required'}, 400)
            device = service_instance.get_device_details(device_id)
            if not device:
                return send_json({'error': 'Device not found'}, 400)
            return send_json({'device': device})

        # 5. POST /lookup-imei
        if (normalized_path == '/lookup-imei' or normalized_path == '/imei-lookup') and request.method == 'POST':
            try:
                body_unicode = request.body.decode('utf-8')
                if len(body_unicode) > 100000:
                    return send_json({'error': 'Payload too large'}, 413)
                body = json.loads(body_unicode) if body_unicode else {}
                imei = body.get('imei', '')
                result = service_instance.get_device_by_imei(imei)
                status_code = 200 if result.get('valid') else 400
                return send_json(result, status_code)
            except json.JSONDecodeError:
                return send_json({'error': 'Invalid JSON request body'}, 400)

        return send_json({'error': 'Not found'}, 404)

    except Exception as err:
        print('[handle_device_api_request] Error:', err)
        return send_json({'error': 'Internal server error', 'message': str(err)}, 500)
