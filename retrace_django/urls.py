from django.contrib import admin
from django.urls import path, re_path
from . import views
from . import ai_chat
from . import device_database

urlpatterns = [
    path('', views.landing_page),
    path('scan', views.scan_page),
    path('scan', views.scan_page),
    path('scan/', views.scan_page),
    path('passport/<str:product_id>', views.passport_page),
    path('passport/<str:product_id>/', views.passport_page),
    path('ai-assistant', views.ai_assistant_page),
    path('ai-assistant/', views.ai_assistant_page),
    path('repairers', views.repairers_page),
    path('repairers/', views.repairers_page),
    path('resale', views.resale_page),
    path('resale/', views.resale_page),
    path('recovery', views.recovery_page),
    path('recovery/', views.recovery_page),
    path('dashboard', views.dashboard_page),
    path('dashboard/', views.dashboard_page),
    path('products/new', views.create_product_page),
    path('products/new/', views.create_product_page),
    path('spare-parts', views.spare_parts_page),
    path('spare-parts/', views.spare_parts_page),
    path('repairers/<str:repairer_id>', views.repairer_profile_page),
    path('repairers/<str:repairer_id>/', views.repairer_profile_page),
    path('repairer/dashboard', views.repairer_dashboard_page),
    path('repairer/dashboard/', views.repairer_dashboard_page),
    path('recycler/dashboard', views.recycler_dashboard_page),
    path('recycler/dashboard/', views.recycler_dashboard_page),
    path('platform-admin', views.admin_dashboard_page),
    path('platform-admin/', views.admin_dashboard_page),
    path('about', views.about_page),
    path('about/', views.about_page),
    path('auth', views.auth_page),
    path('auth/', views.auth_page),
    path('login', views.auth_page),
    path('login/', views.auth_page),
    path('register', views.auth_page),
    path('register/', views.auth_page),
    path('contact', views.contact_page),
    path('contact/', views.contact_page),
    path('facilities', views.facilities_page),
    path('facilities/', views.facilities_page),
    path('how-it-works', views.how_it_works_page),
    path('how-it-works/', views.how_it_works_page),
    path('privacy', views.privacy_page),
    path('privacy/', views.privacy_page),
    path('repair', views.repair_info_page),
    path('repair/', views.repair_info_page),
    path('terms', views.terms_page),
    path('terms/', views.terms_page),
    path('estimator', views.estimator_page),
    path('estimator/', views.estimator_page),
    path('repair-estimator', views.repair_estimator_page),
    path('repair-estimator/', views.repair_estimator_page),
    path('health-score', views.health_score_page),
    path('health-score/', views.health_score_page),
    path('lifecycle-dashboard', views.lifecycle_dashboard_page),
    path('lifecycle-dashboard/', views.lifecycle_dashboard_page),
    path('ewaste-tracker', views.ewaste_tracker_page),
    path('ewaste-tracker/', views.ewaste_tracker_page),
    path('maintenance-predictor', views.maintenance_predictor_page),
    path('maintenance-predictor/', views.maintenance_predictor_page),
    path('second-life', views.second_life_page),
    path('second-life/', views.second_life_page),
    path('repair-vs-resell', views.repair_vs_resell_page),
    path('repair-vs-resell/', views.repair_vs_resell_page),
    path('clean-recycle', views.clean_recycle_page),
    path('clean-recycle/', views.clean_recycle_page),
    path('admin/', admin.site.urls),
    
    # 1. Health check endpoints
    path('health', views.health_check),
    path('health/', views.health_check),
    path('api/health', views.health_check),
    path('api/health/', views.health_check),
    
    # 2. Secure Backend AI Diagnostic Chat endpoint (Gemini API Integration)
    path('api/ai/chat', ai_chat.handle_ai_chat_request),
    path('api/ai/chat/', ai_chat.handle_ai_chat_request),
    
    # Secure Backend AI Text-to-Speech endpoint (ElevenLabs API Integration)
    path('api/ai/tts', ai_chat.handle_ai_tts_request),
    path('api/ai/tts/', ai_chat.handle_ai_tts_request),
    
    path('api/ai/token', ai_chat.handle_elevenlabs_token),
    path('api/ai/token/', ai_chat.handle_elevenlabs_token),
    
    # 2b. Device Database & IMEI Lookup endpoints
    re_path(r'^api/devices(?:/(?P<path>.*))?$', device_database.handle_device_api_request),
    
    # 3. SPA Fallback
    re_path(r'^(?!api/|admin/).*$', views.serve_spa),
]
