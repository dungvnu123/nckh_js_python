import axios from 'axios';

// Base URL cho backend Django
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Đảm bảo URL kết thúc bằng dấu '/' để tránh redirect 301 từ Django
const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl : `${rawApiUrl}/`;

console.log("🚀 API Connection initialized at:", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Thêm Interceptor để tự động đính kèm Access Token vào mọi Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Debug request URL
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm Interceptor để xử lý lỗi Token hết hạn (401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Xử lý Network Error (Lỗi không kết nối được tới Backend)
    if (!error.response) {
      console.error("❌ Network Error: Không thể kết nối đến Backend.");
      console.error("Vui lòng kiểm tra lại cấu hình VITE_API_URL hoặc đảm bảo server backend đang chạy.");
      return Promise.reject(new Error("Lỗi kết nối mạng: Không tìm thấy Backend (Server is down or blocked by CORS)."));
    }
    
    // Nếu lỗi 405 Method Not Allowed
    if (error.response.status === 405) {
      console.error(`❌ Lỗi 405: Phương thức ${error.config.method?.toUpperCase()} không được phép tại ${error.config.url}`);
      console.error("Hãy kiểm tra lại endpoint backend đã cấu hình đúng Method chưa (POST/GET/PATCH/DELETE).");
    }

    // Nếu lỗi 401 (Unauthorized)
    if (error.response.status === 401) {
      console.error("Token có thể đã hết hạn. Đang đăng xuất...");
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
