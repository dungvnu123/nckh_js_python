from rest_framework import serializers
from .models import Khoa, BoMon, GiangVien, SinhVien, DeTai, ThamGiaDeTai, VaiTroSinhVien
from django.contrib.auth.models import User

class KhoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Khoa
        fields = '__all__'


class BoMonSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoMon
        fields = '__all__'


class GiangVienSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiangVien
        fields = '__all__'


class SinhVienSerializer(serializers.ModelSerializer):
    khoa_info = KhoaSerializer(source='khoa', read_only=True)

    class Meta:
        model = SinhVien
        fields = ['ma_sv', 'ten_sv', 'khoa', 'khoa_info']
        extra_kwargs = {
            'khoa': {'write_only': True},
        }


class DeTaiSerializer(serializers.ModelSerializer):
    sinh_vien = serializers.SerializerMethodField()
    class Meta:
        model = DeTai
        fields = '__all__'
        extra_kwargs = {
            'gv_huong_dan': {'allow_null': True, 'required': False},
        }
    def get_sinh_vien(self, obj):
            tham_gia = ThamGiaDeTai.objects.filter(de_tai = obj)
            result = []
            for tg in tham_gia:
                result.append({
                    "ma_sv" : tg.sinh_vien.ma_sv,
                    "ten_sv" : tg.sinh_vien.ten_sv,
                    "vai_tro" : tg.vai_tro
                })

            return result    
class SinhVienActionSerializer(serializers.Serializer):
    ma_sv = serializers.CharField(max_length=200, help_text="Mã sinh viên cần thêm/xóa")
    vai_tro = serializers.ChoiceField(choices=VaiTroSinhVien.choices, default=VaiTroSinhVien.MEMBER, help_text="Vai trò của sinh viên trong đề tài")


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(min_length=6, write_only=True)
