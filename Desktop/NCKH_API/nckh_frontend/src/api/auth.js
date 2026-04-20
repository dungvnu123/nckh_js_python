import api from './axiosConfig';

export const login = async (username, password) => {
  try {
    const response = await api.post('token/', {
      username,
      password
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return { success: true };
    }
  } catch (error) {
    const message = error.response?.data?.detail || "Đăng nhập thất bại. Vui lòng kiểm tra lại.";
    return { success: false, message };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('register/', {
      username,
      email,
      password
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    const message = error.response?.data ? Object.values(error.response.data).flat().join(' ') : "Đăng ký thất bại.";
    return { success: false, message };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('forgot-password/', { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: "Yêu cầu thất bại." };
  }
};

export const resetPassword = async (uid, token, new_password) => {
  try {
    const response = await api.post(`reset-password/${uid}/${token}/`, { new_password });
    return { success: true, message: response.data.message };
  } catch (error) {
    const message = error.response?.data?.error || "Đặt lại mật khẩu thất bại.";
    return { success: false, message };
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
