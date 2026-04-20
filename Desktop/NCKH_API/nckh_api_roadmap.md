# Kế Hoạch Xây Dựng Backend API: Quản Lý Đề Tài NCKH

Dựa trên sơ đồ ERD bạn cung cấp, đây là một dự án **Quản lý Đề tài Nghiên cứu Khoa học (NCKH)**. Mình đã phân tích bản thiết kế dữ liệu của bạn, đưa ra một số góp ý cải thiện, và lập một lộ trình chi tiết để bạn có thể tiến hành code backend bằng **Django REST Framework (DRF)**.

---

## 1. Nhận xét & Đề xuất bổ sung cho Bản thiết kế Database

Bản thiết kế hiện tại (Khoa, Bộ Môn, Sinh Viên, Giảng Viên, Đề Tài, Tham Gia Đề Tài, Tài Trợ, Đơn vị tài trợ) đã bao quát được nghiệp vụ cơ bản. Tuy nhiên, để hệ thống thực tế và hoàn thiện hơn, mình có các đề xuất sau:

### 🚨 Các vấn đề cần điều chỉnh ngay:
1. **Lỗi sơ đồ**: Trong hình của bạn có 2 entity `GiangVien` giống hệt nhau (ở góc bên trái). Bạn nên xóa entity bị lặp đi.
2. **Thiếu hệ thống Tài khoản (Authentication)**: Hiện tại chưa có bảng lưu thông tin đăng nhập. 
   - *Giải pháp*: Trong Django, bạn nên sử dụng `AbstractUser` hoặc kết nối bảng `GiangVien` và `SinhVien` với bảng `User` mặc định của Django qua quan hệ `OneToOneField`. Cách này giúp phân quyền (Role-based access) dễ dàng.

### 💡 Các trường dữ liệu (Fields) nên bổ sung:
- **Bảng `DeTai` (Đề tài)**:
  - Hiện tại chỉ có `Ngày tạo`. Cần bổ sung thêm: `NgayBatDau` (Ngày bắt đầu thực hiện), `NgayKetThucDuKien` (Hạn chót), `NgayNghiemThu` (Ngày báo cáo thực tế).
  - Thêm cột `KinhPhiDuKien` để so sánh với số tiền nhận được từ bảng `TaiTro`.
- **Bảng `TaiTro`**: 
  - Đã đầy đủ, nhưng nếu có các đợt giải ngân khác nhau thì sao? Có thể cân nhắc thêm thuộc tính `DotGiaiNgan` hoặc `GhiChu`.

### 🏗️ Bổ sung thêm Bảng (Entities) mới để đáp ứng thực tế:
1. **Bảng `TaiLieu` (Quản lý file đính kèm)**:
   - Các đề tài NCKH luôn có báo cáo, bản thuyết minh, slide... Sợ đồ của bạn chưa có nơi lưu file.
   - *Thuộc tính*: `id`, `MaDT` (FK), `TenTaiLieu`, `File_URL`, `LoaiTaiLieu` (Thuyết minh/Giữa kỳ/Tổng kết), `NgayNop`.
2. **Thêm Giảng viên đồng hướng dẫn (Tùy chọn)**:
   - Bảng `DeTai` hiện tại chỉ có 1 `MaGV` (là Chủ nhiệm đề tài). Nếu 1 đề tài có nhiều giảng viên tham gia, bạn cần tạo thêm bảng `GiangVienThamGia` tương tự bảng `ThamGiaDeTai` của sinh viên.
3. **Bảng `ChuyenNganh` hoặc `Lop`**:
   - Sinh viên hiện tại đang thuộc thẳng về `Khoa`. Thực tế Sinh Viên thường thuộc 1 `Ngành` hoặc 1 `Lớp` cụ thể. Sẽ tốt hơn nếu thiết kế: `Khoa` 1 -> N `Nganh` 1 -> N `SinhVien`.

---

## 2. Lộ Trình Xây Dựng Backend (Django + DRF)

Dưới đây là các bước để xây dựng hệ thống hệ thống API theo mô hình của bạn.

### Phase 1: Khởi tạo và Thiết lập Database (Tuần 1)
- [ ] Cài đặt môi trường `virtualenv`, cài đặt `Django`, `djangorestframework`, `django-cors-headers` (để kết nối FE).
- [ ] Thiết lập `settings.py` (cấu hình MySQL/PostgreSQL tùy theo dự án).
- [ ] **Custom User Model**: Setup hệ thống user có role (Admin, Giáo Vụ, Giảng Viên, Sinh Viên).
- [ ] **Code Models**: Viết các class trong `models.py` dựa trên ERD (đã bao gồm các đề xuất trên). 
- [ ] Chạy `makemigrations` & `migrate` để tạo DB.
- [ ] Đăng ký Models vào `admin.py` để dùng trang Admin của Django test trực tiếp việc thêm/sửa/xóa Data.

### Phase 2: Xây dựng Core API - DRF (Tuần 2)
- [ ] **Serializers**: Viết ModelSerializers cho từng Model. Sử dụng Nested Serializer để lấy thông tin chi tiết (VD: Gọi Đề tài trả về luôn thông tin Giảng viên chủ nhiệm và List Sinh viên tham gia).
- [ ] **Views & ViewSets**: 
  - Tạo `ModelViewSet` cho Khoa, BoMon, SinhVien, GiangVien, DeTai.
  - CRUD operations chuẩn RESTful (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- [ ] **Routing**: Cấu hình `urls.py` và sử dụng `DefaultRouter` để map URL API gọn gàng.

### Phase 3: Phân quyền & Authentication (Tuần 3)
- [ ] Tích hợp `SimpleJWT` module để cấp Token đăng nhập.
- [ ] Viết API login, lấy Profile User hiện tại.
- [ ] **Phân Quyền (Permissions)**:
  - *Sinh viên* chỉ được xem và xin tham gia đề tài, nộp báo cáo.
  - *Giảng viên* tạo đề tài, duyệt sinh viên, cập nhật trạng thái đề tài.
  - *Admin/Cán bộ Quản lý* xem mọi dữ liệu và xét duyệt tài trợ.

### Phase 4: Các API Phức Tạp & Nâng Cao (Tuần 4)
- [ ] Xử lý Upload file (lưu file minh chứng, báo cáo). Cấu hình `MEDIA_ROOT` và `MEDIA_URL`.
- [ ] API **Lọc và Tìm kiếm (Filter & Search)**: 
  - Lọc đề tài theo trạng thái (pending/approved), lọc theo năm, theo Giảng viên...
  - Sử dụng `django-filter` để làm việc này tối ưu hơn.
- [ ] API **Thống kê (Dashboard)**:
  - Tính tổng số dự án đang chạy cho Khoa/Bộ môn.
  - Tính tổng kinh phí tài trợ đã được duyệt theo từng đơn vị trong một năm.

### Phase 5: Testing & Deployment (Tuần 5)
- [ ] Validate dữ liệu đầu vào. Tối ưu N+1 query bằng `select_related` và `prefetch_related` cho Model.
- [ ] Tự động hóa API Docs tích hợp (sử dụng gói `drf-spectacular` tạo UI Swagger/ReDoc siêu xịn).
- [ ] Deploy lên server: Push source code lên GitHub, config Render / Heroku / AWS. Sử dụng gunicorn, cài đặt PostgreSQL cho production. Cấu hình biến môi trường `.env`.

> [!TIP]
> Bạn nên bắt đầu ngay với Phase 1: Tạo project và viết `models.py`. Trong quá trình viết model, sử dụng `ForeignKey` cẩn thận với tham số `on_delete` (nên là `CASCADE` hoặc `SET_NULL` tùy logic).

Nếu bạn đồng ý với kế hoạch và bản DB này, chúng ta có thể tiến hành bước tiếp theo là khởi tạo project hoặc viết file `models.py`!
