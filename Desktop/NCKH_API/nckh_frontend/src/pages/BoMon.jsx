import React, { useState, useEffect } from 'react';
import { getBoMon, createBoMon, updateBoMon, deleteBoMon, getKhoa } from '../api/services';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus } from 'lucide-react';

const BoMon = () => {
  const [items, setItems] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ma_bm: '', ten_bm: '', khoa: '' });

  useEffect(() => {
    fetchData();
    fetchKhoa();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getBoMon();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKhoa = async () => {
    try {
      const { data } = await getKhoa();
      setKhoas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setFormData(item || { ma_bm: '', ten_bm: '', khoa: khoas[0]?.ma_khoa || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateBoMon(editItem.ma_bm, formData);
        toast.success("Cập nhật bộ môn thành công!");
      } else {
        await createBoMon(formData);
        toast.success("Thêm bộ môn thành công!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng kiểm tra lại thông tin");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc xoá bộ môn này?")) return;
    try {
      await deleteBoMon(id);
      toast.success("Xóa bộ môn thành công!");
      fetchData();
    } catch (error) {
      toast.error("Không thể xoá bộ môn.");
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Quản Lý Bộ Môn</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Thêm Bộ Môn
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
                  <th>Mã Bộ Môn</th>
                  <th>Tên Bộ Môn</th>
                  <th>Khoa Quản Lý</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>Chưa có bộ môn nào.</td></tr>
                ) : items.map(item => (
                  <tr key={item.ma_bm}>
                    <td>{item.ma_bm}</td>
                    <td>{item.ten_bm}</td>
                    <td>{item.khoa_detail?.ten_khoa || item.khoa}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" title="Sửa" style={{ padding: '0.4rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn" title="Xoá" style={{ padding: '0.4rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(item.ma_bm)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Sửa Bộ Môn" : "Thêm Bộ Môn Mới"}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Mã Bộ Môn</label>
            <input 
              required
              disabled={!!editItem}
              className="input-field" 
              value={formData.ma_bm} 
              onChange={e => setFormData({...formData, ma_bm: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tên Bộ Môn</label>
            <input 
              required
              className="input-field" 
              value={formData.ten_bm} 
              onChange={e => setFormData({...formData, ten_bm: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Trực thuộc Khoa</label>
            <select 
              required
              className="input-field"
              value={formData.khoa}
              onChange={e => setFormData({...formData, khoa: e.target.value})}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              <option value="">-- Chọn Khoa --</option>
              {khoas.map(k => (
                <option key={k.ma_khoa} value={k.ma_khoa}>{k.ten_khoa}</option>
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

export default BoMon;
