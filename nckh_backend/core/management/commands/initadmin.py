from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import os

class Command(BaseCommand):
    help = 'Tạo tài khoản Superuser mặc định nếu chưa tồn tại'

    def handle(self, *args, **options):
        # Lấy thông tin từ biến môi trường (hoặc dùng mặc định)
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f'Đang tạo tài khoản admin: {username}...')
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f'Đã tạo thành công tài khoản admin: {username}'))
        else:
            self.stdout.write(self.style.WARNING(f'Tài khoản admin "{username}" đã tồn tại.'))
