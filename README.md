# 🎓 Hệ Thống Quản Lý Nghiên Cứu Khoa Học (NCKH)

Dự án quản lý các đề tài nghiên cứu khoa học, sinh viên và giảng viên. Hệ thống cung cấp API mạnh mẽ, giao diện dashboard hiện đại và hỗ trợ triển khai dễ dàng lên môi trường Production.

---

## 🚀 Tính Năng Chính

- **Quản lý Đề tài**: Thêm, sửa, xóa (soft delete), và quản lý tiến độ.
- **Xác thực & Phân quyền**: Sử dụng JWT (JSON Web Token), hỗ trợ các vai trò Sinh viên, Giảng viên, Quản trị viên.
- **Dashboard thông minh**: Biểu đồ thống kê sử dụng Recharts, giao diện tối ưu trải nghiệm người dùng.
- **Xử lý Dữ liệu**: Hệ thống thùng rác (Trash bin) cho phép khôi phục dữ liệu đã xóa tạm thời.
- **Thông báo**: Tích hợp Toast notification cho phản hồi tức thì.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Framework**: Django 6.0 + Django REST Framework
- **Auth**: SimpleJWT (JWT Authentication)
- **Database**: PostgreSQL (Support Managed Service trên Render/Heroku)
- **Production Server**: Gunicorn + WhiteNoise (phục vụ file tĩnh)

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Modern Design Aesthetics)
- **Icons**: Lucide React
- **Charts**: Recharts
- **API Client**: Axios (với token interceptors)

---

## 📁 Cấu Trúc Thư Mục

```text
NCKH_API/
├── nckh_backend/          # Django Project
│   ├── core/              # App chính: Models, Views, API logic
│   ├── nckh_backend/      # Project settings & URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile           # Cấu hình deploy Render/Heroku
└── nckh_frontend/         # React Project (Vite)
    ├── src/
    │   ├── api/           # Config Axios & Services
    │   ├── components/    # Reusable components
    │   └── pages/         # Dashboard, Login, Management pages
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Cài Đặt Local

### 1. Cài đặt Backend
```bash
cd nckh_backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Cài đặt Frontend
```bash
cd nckh_frontend
npm install
npm run dev
```

---

## ☁️ Hướng Dẫn Triển Khai (Render)

Hệ thống đã được cấu hình sẵn để deploy lên **Render**.

### Backend (Web Service)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn nckh_backend.wsgi`
- **Biến môi trường**:
  - `SECRET_KEY`: Chuỗi bí mật.
  - `DEBUG`: `False`
  - `DATABASE_URL`: Link kết nối Postgres.

### Frontend (Static Site)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Biến môi trường**:
  - `VITE_API_URL`: Link API của backend (ví dụ: `https://api-nckh.onrender.com/api/`)

---

## 📝 Giấy Phép
Dự án được phát triển cho mục đích học tập và nghiên cứu.
