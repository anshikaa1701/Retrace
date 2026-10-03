import os
from django.http import JsonResponse, HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import time
from . import mock_data

def health_check(request):
    """
    Health check endpoint for Docker / Kubernetes / load balancers.
    Replaces /health and /api/health from server.js.
    """
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
        
    return JsonResponse({
        'status': 'ok',
        'app': 'retrace',
        'uptime': int(time.time()), # placeholder for process uptime
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())
    })

def landing_page(request):
    """
    Renders the main landing page converted from React.
    """
    return render(request, 'landing.html')

def scan_page(request):
    """
    Renders the QR Scanner page converted from React.
    """
    return render(request, 'scan.html')

def estimator_page(request):
    """
    Renders the Smart Resale Value Estimator page.
    """
    return render(request, 'estimator.html')

def repair_estimator_page(request):
    """
    Renders the Repair Cost Estimator page.
    """
    return render(request, 'repair_estimator.html')

def health_score_page(request):
    """
    Renders the Product Health Score page.
    """
    return render(request, 'health_score.html')

def lifecycle_dashboard_page(request):
    """
    Renders the Product Lifecycle Dashboard page.
    """
    return render(request, 'lifecycle_dashboard.html')

def ewaste_tracker_page(request):
    return render(request, 'ewaste_tracker.html')

def maintenance_predictor_page(request):
    return render(request, 'maintenance_predictor.html')

def second_life_page(request):
    return render(request, 'second_life.html')

def repair_vs_resell_page(request):
    return render(request, 'repair_vs_resell.html')

def clean_recycle_page(request):
    return render(request, 'clean_recycle.html')

def passport_page(request, product_id):
    """
    Renders the Product Passport page.
    """
    product = mock_data.get_product(product_id)
    events = mock_data.get_product_events(product_id)
    
    if not product:
        return render(request, 'passport.html', {'error': True, 'product_id': product_id})
        
    return render(request, 'passport.html', {
        'error': False,
        'product': product,
        'events': events,
        'is_smartphone': product['category'] == 'Smartphone'
    })

def ai_assistant_page(request):
    """
    Renders the AI Assistant Diagnostics page.
    """
    code = request.GET.get('code')
    products = mock_data.INITIAL_PRODUCTS
    selected_product = products[0]
    
    if code:
        found = mock_data.get_product(code)
        if found:
            selected_product = found
            
    # Load Agent ID from environment without hardcoding
    import os
    elevenlabs_agent_id = os.environ.get('ELEVENLABS_AGENT_ID', '')
            
    return render(request, 'ai_assistant.html', {
        'products': products,
        'selected_product': selected_product,
        'elevenlabs_agent_id': elevenlabs_agent_id
    })

def repairers_page(request):
    """
    Renders the Repairers directory page.
    """
    repairers = mock_data.INITIAL_REPAIRERS
    return render(request, 'repairers.html', {
        'repairers': repairers
    })

def resale_page(request):
    """
    Renders the Resale Marketplace page.
    """
    listings = mock_data.INITIAL_RESALE_LISTINGS
    return render(request, 'resale.html', {
        'listings': listings
    })

def recovery_page(request):
    """
    Renders the Zero-Landfill Recovery page.
    """
    return render(request, 'recovery.html', {
        'products': mock_data.INITIAL_PRODUCTS,
        'recoveryPartners': mock_data.INITIAL_RECOVERY_PARTNERS
    })

def dashboard_page(request):
    """
    Renders the Owner Dashboard page.
    """
    products = mock_data.INITIAL_PRODUCTS
    total_products = len(products)
    
    # Compute metrics
    active_repairs_count = 1  # Mocked
    total_verified_repairs = sum([p.get('verifiedRepairsCount', 0) for p in products])
    resold_products_count = len([p for p in products if p.get('lifecycleStatus') == 'RESOLD'])
    recovered_products_count = len([p for p in products if p.get('lifecycleStatus') in ['IN_RECOVERY', 'END_OF_LIFE']])
    
    current_user = {
        'name': 'Avi Sharma',
        'email': 'avi.sharma@example.com',
        'role': 'OWNER'
    }

    return render(request, 'dashboard.html', {
        'products': products,
        'current_user': current_user,
        'total_products': total_products,
        'active_repairs_count': active_repairs_count,
        'total_verified_repairs': total_verified_repairs,
        'resold_products_count': resold_products_count,
        'recovered_products_count': recovered_products_count
    })

def create_product_page(request):
    """
    Renders the Product Registration (Mint Passport) page.
    """
    return render(request, 'create_product.html')

def spare_parts_page(request):
    """
    Renders the Compatible Spare Part Finder page.
    """
    return render(request, 'spare_parts.html', {
        'parts': mock_data.INITIAL_SPARE_PARTS
    })

def repairer_profile_page(request, repairer_id):
    """
    Renders the Repairer Profile page.
    """
    repairer = next((r for r in mock_data.INITIAL_REPAIRERS if r['id'] == repairer_id), mock_data.INITIAL_REPAIRERS[0])
    reviews = [rev for rev in mock_data.INITIAL_REPAIR_REVIEWS if rev['repairerId'] == repairer_id]
    
    return render(request, 'repairer_profile.html', {
        'repairer': repairer,
        'reviews': sorted(reviews, key=lambda x: x['createdAt'], reverse=True)
    })

def repairer_dashboard_page(request):
    """
    Renders the Repairer Command Hub (Dashboard).
    """
    shop = mock_data.INITIAL_REPAIRERS[0] # TechFix
    reviews = [rev for rev in mock_data.INITIAL_REPAIR_REVIEWS if rev['repairerId'] == shop['id']]
    
    # We will split INITIAL_REPAIR_REQUESTS by status. 
    # But wait, INITIAL_REPAIR_REQUESTS is not in mock_data.py yet!
    # I should pass empty lists and let them be populated by the default state for now, 
    # except wait, there's no INITIAL_REPAIR_REQUESTS in mockData.ts either, it's defined in AppContext.tsx.
    # Let's mock a few requests for the dashboard.
    
    incoming_requests = [
      {
        'id': 'req-init-1',
        'productId': 'prod-dell-72891',
        'productName': 'Dell Inspiron 15 5000',
        'productCode': 'RP-DL-72891',
        'customerId': 'user-avi',
        'customerName': 'Avi Sharma',
        'repairerId': 'rep-techfix',
        'repairerName': 'TechFix Solutions',
        'issue': 'Thermal Management & Fan Rattle',
        'description': 'Machine overheats during moderate workload, shutting down automatically after 15 minutes of use.',
        'preferredDate': '2026-09-28',
        'status': 'REQUESTED',
        'createdAt': '2026-09-24T10:00:00Z',
        'quoteAmount': 3000
      }
    ]
    
    return render(request, 'repairer_dashboard.html', {
        'shop': shop,
        'reviews': sorted(reviews, key=lambda x: x['createdAt'], reverse=True),
        'incoming_requests': incoming_requests,
        'active_repairs': [],
        'completed_repairs': []
    })

def recycler_dashboard_page(request):
    """
    Renders the Circular Partner (Recycler) Dashboard.
    """
    pending_requests = [
      {
        'id': 'rec-req-1',
        'productId': 'prod-hp-19830',
        'productName': 'HP Pavilion Aero 13',
        'productCode': 'RP-HP-19830',
        'partnerId': 'rec-greencycle',
        'partnerName': 'GreenCycle Circular Hub',
        'recoveryType': 'E_WASTE_RECYCLING',
        'condition': 'Irreparable motherboard liquid damage',
        'estimatedValue': 800,
        'pickupAddress': 'Indiranagar 100ft Rd, Bangalore 560038',
        'pickupDate': '2026-09-26',
        'status': 'REQUESTED',
        'createdAt': '2026-09-29T10:00:00Z'
      }
    ]

    return render(request, 'recycler_dashboard.html', {
        'pending_requests': pending_requests,
        'verified_recoveries': []
    })

def admin_dashboard_page(request):
    """
    Renders the Root Admin Platform Governance Dashboard.
    """
    products = mock_data.INITIAL_PRODUCTS
    repairers = mock_data.INITIAL_REPAIRERS
    recovery_partners = mock_data.INITIAL_RECOVERY_PARTNERS

    ledger_events = []
    for p in products:
        for e in p.get('events', []):
            ledger_events.append({
                'id': e['id'],
                'productId': p['productId'],
                'title': e['title'],
                'description': e['description'],
                'timestamp': e['timestamp'],
                'actorName': e['actorName'],
                'verificationLevel': e.get('verificationLevel', 'STANDARD')
            })
    
    # Sort descending
    ledger_events.sort(key=lambda x: x['timestamp'], reverse=True)

    pending_repairers = [r for r in repairers if r.get('verificationStatus') == 'PENDING']
    verified_repairers = [r for r in repairers if r.get('verificationStatus') == 'VERIFIED']

    context = {
        'products': products,
        'repairers': repairers,
        'recovery_partners': recovery_partners,
        'pending_repairers': pending_repairers,
        'verified_repairers': verified_repairers,
        'ledger_events': ledger_events,
        'total_products': len(products),
        'active_products': len([p for p in products if p.get('lifecycleStatus') == 'ACTIVE']),
        'total_verified_repairs': sum(p.get('verifiedRepairsCount', 0) for p in products),
        'total_resales': len([p for p in products if p.get('lifecycleStatus') == 'RESOLD']),
        'total_recoveries': len([p for p in products if p.get('lifecycleStatus') == 'IN_RECOVERY']),
        'total_recycled': len([p for p in products if p.get('lifecycleStatus') in ['END_OF_LIFE', 'RECYCLED']])
    }

    return render(request, 'admin_dashboard.html', context)

def about_page(request):
    return render(request, 'about.html')

def auth_page(request):
    return render(request, 'auth.html')

def contact_page(request):
    return render(request, 'contact.html')

def facilities_page(request):
    return render(request, 'facilities.html')

def how_it_works_page(request):
    return render(request, 'how_it_works.html')

def privacy_page(request):
    return render(request, 'privacy.html')

def repair_info_page(request):
    return render(request, 'repair_info.html', {
        'repairers': mock_data.INITIAL_REPAIRERS,
    })

def terms_page(request):
    return render(request, 'terms.html')

def serve_spa(request, path=''):
    """
    SPA Fallback: serve dist/index.html for client-side routing.
    Replaces the fallback logic in server.js.
    """
    index_path = os.path.join(settings.BASE_DIR, 'dist', 'index.html')
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except FileNotFoundError:
        return HttpResponse('<h1>404 - Application Not Built Yet</h1><p>Run "npm run build" to generate dist/ assets.</p>', status=404)
