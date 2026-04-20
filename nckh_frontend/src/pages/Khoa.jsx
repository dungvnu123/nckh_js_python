import React, { useState, useEffect } from 'react';
import { getKhoa, createKhoa, updateKhoa, deleteKhoa } from '../api/services';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Khoa = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ma_khoa: '', ten_khoa: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getKhoa();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setFormData(item || { ma_khoa: '', ten_khoa: '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateKhoa(editItem.ma_khoa, formData);
        toast.success("Cập nhật khoa thành công!");
      } else {
        await createKhoa(formData);
        toast.success("Thêm khoa mới thành công!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : (error.message || 'Lỗi không xác định');
      toast.error("Thao tác thất bại: " + errorMsg);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc xoá khoa này?")) return;
    try {
      await deleteKhoa(id);
      toast.success("Xoá khoa thành công!");
      fetchData();
    } catch (error) {
      toast.error("Không thể xoá khoa (Có thể có bộ môn trực thuộc).");
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Quản Lý Khoa</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Thêm Khoa
        </button>
      </div>

      <div className="glass-panel">
        <div className="table-container">
          {loading ? (
             <p style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Mã Khoa</th>
                  <th>Tên Khoa</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Chưa có khoa nào.</td></tr>
                ) : items.map(item => (
                  <tr key={item.ma_khoa}>
                    <td>{item.ma_khoa}</td>
                    <td>{item.ten_khoa}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" title="Sửa" style={{ padding: '0.4rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }} onClick={() => handleOpenModal(item)}>
                         <Edit2 size={16} />
                      </button>
                      <button className="btn" title="Xoá" style={{ padding: '0.4rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(item.ma_khoa)}>
                         <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Sửa Khoa" : "Thêm Khoa Mới"}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Mã Khoa</label>
            <input 
              required
              disabled={!!editItem}
              className="input-field" 
              value={formData.ma_khoa} 
              onChange={e => setFormData({...formData, ma_khoa: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tên Khoa</label>
            <input 
              required
              className="input-field" 
              value={formData.ten_khoa} 
              onChange={e => setFormData({...formData, ten_khoa: e.target.value})} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Khoa;
