import React, { useState, useEffect } from 'react';
import { getGiangVien, createGiangVien, updateGiangVien, deleteGiangVien, getBoMon } from '../api/services';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus } from 'lucide-react';

const GiangVien = () => {
  const [items, setItems] = useState([]);
  const [boMons, setBoMons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ma_gv: '', ten_gv: '', email: '', bo_mon: '' });

  useEffect(() => {
    fetchData();
    fetchBoMon();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getGiangVien();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoMon = async () => {
    try {
      const { data } = await getBoMon();
      setBoMons(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setFormData(item || { ma_gv: '', ten_gv: '', email: '', bo_mon: boMons[0]?.ma_bm || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateGiangVien(editItem.ma_gv, formData);
        toast.success("Cập nhật giảng viên thành công!");
      } else {
        await createGiangVien(formData);
        toast.success("Thêm giảng viên thành công!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi kết nối hoặc dữ liệu không hợp lệ.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc xoá giảng viên này?")) return;
    try {
      await deleteGiangVien(id);
      toast.success("Xoá giảng viên thành công!");
      fetchData();
    } catch (error) {
      toast.error("Không thể xoá giảng viên.");
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Quản Lý Giảng Viên</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Thêm Giảng Viên
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
                  <th>Mã GV</th>
                  <th>Tên Giảng Viên</th>
                  <th>Email</th>
                  <th>Bộ Môn</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Chưa có dữ liệu.</td></tr>
                ) : items.map(item => (
                  <tr key={item.ma_gv}>
                    <td>{item.ma_gv}</td>
                    <td>{item.ten_gv}</td>
                    <td>{item.email}</td>
                    <td>{item.bo_mon_detail?.ten_bm || item.bo_mon}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" title="Sửa" style={{ padding: '0.4rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn" title="Xoá" style={{ padding: '0.4rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(item.ma_gv)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Sửa Giảng Viên" : "Thêm Giảng Viên"}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Mã Giảng Viên</label>
            <input 
              required
              disabled={!!editItem}
              className="input-field" 
              value={formData.ma_gv} 
              onChange={e => setFormData({...formData, ma_gv: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tên Giảng Viên</label>
            <input 
              required
              className="input-field" 
              value={formData.ten_gv} 
              onChange={e => setFormData({...formData, ten_gv: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email"
              required
              className="input-field" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Trực thuộc Bộ môn</label>
            <select 
              required
              className="input-field"
              value={formData.bo_mon}
              onChange={e => setFormData({...formData, bo_mon: e.target.value})}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              <option value="">-- Chọn Bộ Môn --</option>
              {boMons.map(b => (
                <option key={b.ma_bm} value={b.ma_bm}>{b.ten_bm}</option>
              ))}
            </select>
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

export default GiangVien;
