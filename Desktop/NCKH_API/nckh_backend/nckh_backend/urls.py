from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.views import (
    KhoaViewSet,
    BoMonViewSet,
    GiangVienViewSet,
    SinhVienViewSet,
    DeTaiViewSet,
    DeTaiViewSet,
    DashboardView,
    RegisterView,
    ForgotPasswordView,
    ResetPasswordView,
)

router = DefaultRouter()
router.register(r'khoa', KhoaViewSet)
router.register(r'bomon', BoMonViewSet)
router.register(r'giangvien', GiangVienViewSet)
router.register(r'sinhvien', SinhVienViewSet)
router.register(r'detai', DeTaiViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/dashboard/', DashboardView.as_view()),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('api/reset-password/<str:uidb64>/<str:token>/', ResetPasswordView.as_view(), name='reset_password'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]