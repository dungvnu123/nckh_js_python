from rest_framework.permissions import BasePermission
from .models import HuongDanDeTai , ThamGiaDeTai

class IsGiangVien(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff 

class IsGiangVienChinh(BasePermission):
    def has_object_permission(self, request, view, obj): #obj = detaihientai
        return HuongDanDeTai.objects.filter(
            de_tai = obj,
            giang_vien__email = request.user.email,
            vai_tro = 'main'
        ).exists()

class IsLeader(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        return ThamGiaDeTai.objects.filter(
            de_tai=obj,
            sinh_vien__ma_sv=user.username,
            vai_tro='leader'
        ).exists()