import React, { useState, useEffect } from 'react';
import { getSinhVien, createSinhVien, updateSinhVien, deleteSinhVien, getKhoa, getDeTaiCuaSinhVien } from '../api/services';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';

const SinhVien = () => {
  const [items, setItems] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ma_sv: '', ten_sv: '', khoa: '' });

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedSv, setSelectedSv] = useState(null);
  const [svDeTais, setSvDeTais] = useState([]);

  useEffect(() => {
    fetchData();
    fetchKhoa();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getSinhVien();
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
    setFormData(item || { ma_sv: '', ten_sv: '', khoa: khoas[0]?.ma_khoa || '' });
    setModalOpen(true);
  };

  const handleOpenDetail = async (sv) => {
    setSelectedSv(sv);
    setDetailModalOpen(true);
    setSvDeTais([]);
    try {
      const { data } = await getDeTaiCuaSinhVien(sv.ma_sv);
      setSvDeTais(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateSinhVien(editItem.ma_sv, formData);
        toast.success("Cập nhật sinh viên thành công!");
      } else {
        await createSinhVien(formData);
        toast.success("Thêm sinh viên thành công!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi kết nối hoặc dữ liệu không hợp lệ.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc xoá sinh viên này?")) return;
    try {
      await deleteSinhVien(id);
      toast.success("Xoá sinh viên thành công!");
      fetchData();
    } catch (error) {
      toast.error("Không thể xoá sinh viên.");
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Quản Lý Sinh Viên</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Thêm Sinh Viên
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
                  <th>Mã SV</th>
                  <th>Tên Sinh Viên</th>
                  <th>Khoa</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>Chưa có dữ liệu.</td></tr>
                ) : items.map(item => (
                  <tr key={item.ma_sv}>
                    <td>{item.ma_sv}</td>
                    <td>{item.ten_sv}</td>
                    <td>{item.khoa_detail?.ten_khoa || item.khoa}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" title="Xem Đề Tài" style={{ padding: '0.4rem', border: '1px solid var(--success)', color: 'var(--success)', background: 'transparent' }} onClick={() => handleOpenDetail(item)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn" title="Sửa" style={{ padding: '0.4rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn" title="Xoá" style={{ padding: '0.4rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(item.ma_sv)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Sửa Sinh Viên" : "Thêm Sinh Viên"}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Mã Sinh Viên</label>
            <input 
              required
              disabled={!!editItem}
              className="input-field" 
              value={formData.ma_sv} 
              onChange={e => setFormData({...formData, ma_sv: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tên Sinh Viên</label>
            <input 
              required
              className="input-field" 
              value={formData.ten_sv} 
              onChange={e => setFormData({...formData, ten_sv: e.target.value})} 
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

      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Đề tài của SV: ${selectedSv?.ten_sv}`}>
         {svDeTais.length === 0 ? (
           <p className="text-muted">Sinh viên này chưa tham gia đề tài nào.</p>
         ) : (
            <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mã ĐT</th>
                  <th>Tên ĐT</th>
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {svDeTais.map((dt, idx) => (
                  <tr key={idx}>
                    <td>{dt.ma_dt}</td>
                    <td>{dt.ten_dt}</td>
                    <td>
                        <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            backgroundColor: dt.vai_tro === 'leader' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                            color: dt.vai_tro === 'leader' ? '#818CF8' : '#cbd5e1'
                          }}>
                            {dt.vai_tro.toUpperCase()}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         )}
      </Modal>
    </div>
  );
};

export default SinhVien;
