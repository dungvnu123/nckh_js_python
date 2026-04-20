from django.shortcuts import render
from rest_framework import viewsets
from .models import Khoa, BoMon, GiangVien, SinhVien, DeTai, ThamGiaDeTai
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.response import Response 
from rest_framework.decorators import action
from rest_framework import  status 
from .permissions import IsGiangVien, IsGiangVienChinh ,  IsLeader
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum
from django.db.models.functions import Coalesce
from django.db.models import DecimalField
from decimal import Decimal
from rest_framework.filters import SearchFilter , OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
class KhoaViewSet(viewsets.ModelViewSet):
    queryset = Khoa.objects.all()
    serializer_class = KhoaSerializer


class BoMonViewSet(viewsets.ModelViewSet):
    queryset = BoMon.objects.all()
    serializer_class = BoMonSerializer


class GiangVienViewSet(viewsets.ModelViewSet):
    queryset = GiangVien.objects.all()
    serializer_class = GiangVienSerializer


class SinhVienViewSet(viewsets.ModelViewSet):
    queryset = SinhVien.objects.all()
    serializer_class = SinhVienSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = {
        'khoa': ['exact'],
        'khoa__ten_khoa': ['icontains'],
    }
    @action(detail=True, methods=['get'])
    def detai(self,  request, pk= None):
        sinh_vien = self.get_object()

        tham_gia = ThamGiaDeTai.objects.filter(sinh_vien = sinh_vien)
        result = []
        for i in tham_gia:
            result.append({
                'ma_dt' : i.de_tai.ma_dt,
                'ten_dt' : i.de_tai.ten_dt,
                'vai_tro' : i.vai_tro
            })
        return Response(result)    

    search_fields = ['ten_sv', 'ma_sv']
    ordering_fields = ['ten_sv']
class DeTaiViewSet(viewsets.ModelViewSet):
    queryset = DeTai.objects.all()
    serializer_class = DeTaiSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai']
    search_fields = ['ten_dt', 'trang_thai']
    ordering = ['ngay_tao']

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsGiangVienChinh()]
        elif self.action == 'create':
            return [IsGiangVien()]
        return [IsAuthenticated()]
    
    @action(detail=True , methods=['get'])
    def get_de_tai(self, request, pk= None):
        de_tai = self.get_object()
        tgdt_list = ThamGiaDeTai.objects.filter(de_tai=de_tai).select_related('sinh_vien')
        sinhviens = [tgdt.sinh_vien for tgdt in tgdt_list]
        serializer = SinhVienSerializer(sinhviens, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], serializer_class=SinhVienActionSerializer)
    def add_sinhvien(self, request , pk = None):
        de_tai = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        ma_sv = serializer.validated_data.get('ma_sv')
        vai_tro = serializer.validated_data.get('vai_tro')
        try:
            sinh_vien = SinhVien.objects.get(ma_sv=ma_sv)

            existing_tham_gia = ThamGiaDeTai.all_objects.filter(de_tai=de_tai, sinh_vien=sinh_vien).first()
            if existing_tham_gia:
                if not existing_tham_gia.is_deleted:
                    return Response({'error': 'Sinh viên đã tham gia đề tài'}, status=400)

            if ThamGiaDeTai.objects.filter(de_tai=de_tai).count() >= 3:
                return Response({'error': 'Đề tài đã đủ 3 sinh viên'}, status=400)

            if vai_tro == 'leader':
                if ThamGiaDeTai.objects.filter(de_tai=de_tai, vai_tro='leader').exists():
                    return Response({'error': 'Đề tài đã có leader'}, status=400)
                    
            if existing_tham_gia and existing_tham_gia.is_deleted:
                existing_tham_gia.is_deleted = False
                existing_tham_gia.vai_tro = vai_tro
                existing_tham_gia.save()
            else:
                ThamGiaDeTai.objects.create(de_tai=de_tai, sinh_vien=sinh_vien, vai_tro=vai_tro)
            return Response({'message': 'Add successful!'}, status=status.HTTP_201_CREATED)
        except SinhVien.DoesNotExist:
            return Response({'message': 'Sinh viên không tồn tại!'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'message': f'Lỗi: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], serializer_class=SinhVienActionSerializer)
    def remove_sinhvien(self, request, pk=None):
        de_tai = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        ma_sv = serializer.validated_data.get('ma_sv')

        try:
            tham_gia = ThamGiaDeTai.objects.get(
               de_tai=de_tai,
               sinh_vien__ma_sv=ma_sv
            )

            if tham_gia.vai_tro == 'leader':
                return Response({'error': 'Không thể xóa leader'}, status=400)

            tham_gia.delete()

            return Response({'message': 'Removed successfully'})

        except ThamGiaDeTai.DoesNotExist:
             return Response({'error': 'Không tồn tại'}, status=404)
    
    @action(detail=True, methods=['post'], permission_classes=[IsLeader], serializer_class=SinhVienActionSerializer)
    def transfer_sinhvien(self, request, pk=None):
        de_tai = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        ma_sv = serializer.validated_data.get('ma_sv')

        try:
            # 1. Tìm bản ghi của sinh viên sẽ làm leader mới
            new_leader = ThamGiaDeTai.objects.get(
                de_tai=de_tai,
                sinh_vien__ma_sv=ma_sv
            )
            # 2. Tìm bản ghi của leader hiện tại của đề tài
            current_leader = ThamGiaDeTai.objects.get(
                de_tai=de_tai,
                vai_tro='leader'
            )
            
            if current_leader.sinh_vien.ma_sv == ma_sv:
              return Response({'error': 'Sinh viên này đã là leader'}, status=400)

            # Hoán đổi quyền
            current_leader.vai_tro = 'member'
            current_leader.save()
            
            new_leader.vai_tro = 'leader'
            new_leader.save()
            return Response({'message': 'Chuyển leader thành công'})

        except ThamGiaDeTai.DoesNotExist:
           return Response({'error': 'Sinh viên không thuộc đề tài, hoặc đề tài chưa có leader'}, status=404)
        except ThamGiaDeTai.MultipleObjectsReturned:
           return Response({'error': 'Lỗi dữ liệu: Có nhiều hơn 1 leader trong đề tài'}, status=500)
        
    @action(detail = False, methods=['get'])
    def thong_ke(self, request ):
        
        tong_so_dt = DeTai.objects.count()
        thong_ke_trang_thai = DeTai.objects.values('trang_thai').annotate(so_luong=Count('ma_dt'))
        
        # Thống kê top giảng viên hướng dẫn nhiều đề tài nhất
        top_gv_huong_dan = DeTai.objects.values('gv_huong_dan__ten_gv').annotate(
            so_luong=Count('ma_dt')
        ).order_by('-so_luong')[:5]

        # Thống kê sinh viên leader và tổng tài trợ nhận được
        sv_leader_tai_tro = ThamGiaDeTai.objects.filter(
            vai_tro='leader'
        ).values(
            'sinh_vien__ma_sv', 
            'sinh_vien__ten_sv'
        ).annotate(
            tong_tai_tro=Coalesce(Sum('de_tai__taitro__so_tien'), Decimal('0.0'), output_field=DecimalField())
        ).order_by('-tong_tai_tro')

        return Response({
            'tong_so_de_tai': tong_so_dt,
            'theo_trang_thai': thong_ke_trang_thai,
            'top_giang_vien_huong_dan': top_gv_huong_dan,
            'sinh_vien_leader_tai_tro': sv_leader_tai_tro
        })
    # submit đề tài 
    @action(detail=True, methods=['post'], permission_classes = [IsLeader])
    def submit(self, requets, pk= None):
        de_tai = self.get_object()
        de_tai.trang_thai = 'pending'
        de_tai.save()
        return Response({'message' : 'Đã gửi duyệt!'})
    @action(detail=True, methods=['post'], permission_classes = [IsGiangVien])
    def approve(self, request, pk=None):
        de_tai = self.get_object()

        de_tai.trang_thai = 'approved'
        de_tai.save()

        return Response({"message": "Đã duyệt"})
    @action(detail=True, methods=['post'], permission_classes = [IsGiangVien])
    def reject(self, request, pk=None):
        de_tai = self.get_object()

        de_tai.trang_thai = 'rejected'
        de_tai.save()

        return Response({"message": "Đã từ chối"})

class DashboardView(APIView):

    def get(self, request):
        data = {
            "tong_detai": DeTai.objects.filter(is_deleted=False).count(),
            "approved": DeTai.objects.filter(trang_thai='approved', is_deleted=False).count(),
            "pending": DeTai.objects.filter(trang_thai='pending', is_deleted=False).count(),
            "rejected": DeTai.objects.filter(trang_thai='rejected', is_deleted=False).count(),

            "tong_sinh_vien": SinhVien.objects.count(),
            "tong_giang_vien": GiangVien.objects.count(),
        }

        return Response(data)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                # In a real app, this would be your frontend URL
                reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
                
                send_mail(
                    "Đặt lại mật khẩu - NCKH",
                    f"Chào {user.username},\n\nĐể đặt lại mật khẩu, vui lòng click vào link sau: {reset_link}",
                    None,
                    [email],
                    fail_silently=False,
                )
            # Standard security practice: return success even if email not found
            return Response({"message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user is not None and default_token_generator.check_token(user, token):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({"message": "Đặt lại mật khẩu thành công!"})
            else:
                return Response({"error": "Link không hợp lệ hoặc đã hết hạn."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    