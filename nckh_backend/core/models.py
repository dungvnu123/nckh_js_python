from django.db import models
from django.contrib.auth.models import User

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

class Khoa(SoftDeleteModel):
    ma_khoa = models.CharField(max_length=200, primary_key=True)
    ten_khoa = models.CharField(max_length=200)

    def __str__(self):
        return self.ten_khoa


class BoMon(SoftDeleteModel):
    ma_bm = models.CharField(max_length=200, primary_key=True)
    ten_bm = models.CharField(max_length=200)
    
    khoa = models.ForeignKey(
        Khoa,
        on_delete=models.CASCADE,
        related_name='bomon'
    )

    def __str__(self):
        return self.ten_bm

class GiangVien(SoftDeleteModel):
    ma_gv = models.CharField(max_length=200, primary_key=True)
    ten_gv = models.CharField(max_length=200)
    email = models.EmailField()

    bo_mon = models.ForeignKey(
        BoMon,
        on_delete=models.CASCADE,
        related_name='giangvien'
    )

    def __str__(self):
        return self.ten_gv


class SinhVien(SoftDeleteModel):
    ma_sv = models.CharField(max_length=200, primary_key=True)
    ten_sv = models.CharField(max_length=200)

    khoa = models.ForeignKey(
        Khoa,
        on_delete=models.CASCADE,
        related_name='sinhvien'
    )

    def __str__(self):
        return self.ten_sv


class DeTai(SoftDeleteModel):
    ma_dt = models.CharField(max_length=200, primary_key=True)
    ten_dt = models.CharField(max_length=200)
    trang_thai_choices = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    trang_thai = models.CharField(
        max_length=200,
        choices = trang_thai_choices,
        default='draft'
    )

    ngay_tao = models.DateTimeField(auto_now_add=True)

    gv_huong_dan = models.ForeignKey(
        GiangVien,
        on_delete=models.CASCADE,
        related_name='detai',
        null=True,
        blank=True
    )

    def __str__(self):
        return self.ten_dt

class VaiTroSinhVien(models.TextChoices):
    LEADER = 'leader', 'Leader'
    MEMBER = 'member', 'Member'

class ThamGiaDeTai(SoftDeleteModel):
    de_tai = models.ForeignKey(DeTai, on_delete=models.CASCADE)
    sinh_vien = models.ForeignKey(SinhVien, on_delete=models.CASCADE)
    vai_tro = models.CharField(
        max_length=20,
        choices=VaiTroSinhVien.choices,
        default=VaiTroSinhVien.MEMBER
    )
    class Meta:
        unique_together = ['de_tai', 'sinh_vien']
    
    def __str__(self):
        return f"{self.de_tai} - {self.sinh_vien}"

class DonViTaiTro(SoftDeleteModel):
    ma_dvtt = models.CharField(max_length=200 , primary_key=True)
    ten_dvtt = models.CharField(max_length=200)

    def __str__(self):
        return self.ten_dvtt

class TaiTro(SoftDeleteModel):
    de_tai = models.ForeignKey(
        DeTai,
        on_delete=models.CASCADE,
        related_name='taitro'
    )

    don_vi = models.ForeignKey(
        DonViTaiTro,
        on_delete=models.CASCADE
    )

    so_tien = models.DecimalField(max_digits=12, decimal_places=2)

    trang_thai = models.CharField(max_length=50)  # pending / approved

    ngay_dang_ky = models.DateField()
    ngay_duyet = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.de_tai} - {self.so_tien}"           

class HuongDanDeTai(SoftDeleteModel):
    de_tai = models.ForeignKey(DeTai, on_delete=models.CASCADE)
    giang_vien = models.ForeignKey(GiangVien, on_delete=models.CASCADE)

    vai_tro = models.CharField(
        max_length=20,
        choices=(
            ('main', 'chính'),
            ('member', 'phụ')
        )
    )
    class Meta:
        unique_together = ['de_tai', 'giang_vien']