import api from './axiosConfig';

// --- Khoa ---
export const getKhoa = () => api.get('khoa/');
export const createKhoa = (data) => api.post('khoa/', data);
export const updateKhoa = (id, data) => api.patch(`khoa/${id}/`, data);
export const deleteKhoa = (id) => api.delete(`khoa/${id}/`);

// --- Bo Mon ---
export const getBoMon = () => api.get('bomon/');
export const createBoMon = (data) => api.post('bomon/', data);
export const updateBoMon = (id, data) => api.patch(`bomon/${id}/`, data);
export const deleteBoMon = (id) => api.delete(`bomon/${id}/`);

// --- Giang Vien ---
export const getGiangVien = () => api.get('giangvien/');
export const createGiangVien = (data) => api.post('giangvien/', data);
export const updateGiangVien = (id, data) => api.patch(`giangvien/${id}/`, data);
export const deleteGiangVien = (id) => api.delete(`giangvien/${id}/`);

// --- Sinh Vien ---
export const getSinhVien = () => api.get('sinhvien/');
export const createSinhVien = (data) => api.post('sinhvien/', data);
export const updateSinhVien = (id, data) => api.patch(`sinhvien/${id}/`, data);
export const deleteSinhVien = (id) => api.delete(`sinhvien/${id}/`);
export const getDeTaiCuaSinhVien = (id) => api.get(`sinhvien/${id}/detai/`);

// --- De Tai ---
export const getDeTai = () => api.get('detai/');
export const getDeTaiDetail = (id) => api.get(`detai/${id}/`);
export const createDeTai = (data) => api.post('detai/', data);
export const updateDeTai = (id, data) => api.patch(`detai/${id}/`, data);
export const deleteDeTai = (id) => api.delete(`detai/${id}/`);

// De Tai actions
export const getSinhVienDeTai = (id) => api.get(`detai/${id}/get_de_tai/`);
export const addSinhVienDeTai = (id, data) => api.post(`detai/${id}/add_sinhvien/`, data);
export const removeSinhVienDeTai = (id, data) => api.post(`detai/${id}/remove_sinhvien/`, data);
export const transferSinhVienDeTai = (id, data) => api.post(`detai/${id}/transfer_sinhvien/`, data);
export const submitDeTai = (id) => api.post(`detai/${id}/submit/`);
export const approveDeTai = (id) => api.post(`detai/${id}/approve/`);
export const rejectDeTai = (id) => api.post(`detai/${id}/reject/`);

// Dashboard & Stats
export const getDashboardStats = () => api.get('dashboard/');
export const getDeTaiStats = () => api.get('detai/thong_ke/');
