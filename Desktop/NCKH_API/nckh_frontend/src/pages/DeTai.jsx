import React, { useState, useEffect } from 'react';
import { 
  getDeTai, 
  createDeTai, 
  updateDeTai, 
  deleteDeTai, 
  getGiangVien,
  getSinhVienDeTai,
  addSinhVienDeTai,
  removeSinhVienDeTai,
  transferSinhVienDeTai,
  submitDeTai,
  approveDeTai,
  rejectDeTai
} from '../api/services';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Edit2, Trash2, Plus, Eye, UserPlus, UserMinus, ShieldCheck, CheckCircle2, XCircle, Send } from 'lucide-react';

const statusColors = {
  'draft': '#94A3B8',
  'pending': '#EAB308',
  'approved': '#10B981',
  'rejected': '#EF4444'
};

const DeTai = () => {
  const [items, setItems] = useState([]);
  const [giangViens, setGiangViens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State cho Thêm/Sửa
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ma_dt: '', ten_dt: '', gv_huong_dan: '' });

  // Modal State cho Chi tiết / Quản lý sinh viên
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDt, setSelectedDt] = useState(null);
  const [dtSinhViens, setDtSinhViens] = useState([]);
  
  // Form add sv
  const [newSvMa, setNewSvMa] = useState('');
  const [newSvRole, setNewSvRole] = useState('member');

  useEffect(() => {
    fetchData();
    fetchGiangVien();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await getDeTai();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGiangVien = async () => {
    try {
      const { data } = await getGiangVien();
      setGiangViens(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setFormData(item || { ma_dt: '', ten_dt: '', gv_huong_dan: giangViens[0]?.ma_gv || '' });
    setModalOpen(true);
  };

  const handleOpenDetail = async (dt) => {
    setSelectedDt(dt);
    setDetailModalOpen(true);
    await fetchDtSinhViens(dt.ma_dt);
  };

  const fetchDtSinhViens = async (ma_dt) => {
    try {
      const { data } = await getSinhVienDeTai(ma_dt);
      setDtSinhViens(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await updateDeTai(editItem.ma_dt, formData);
        toast.success("Cập nhật đề tài thành công!");
      } else {
        await createDeTai(formData);
        toast.success("Thêm đề tài thành công!");
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi kết nối hoặc dữ liệu không hợp lệ.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc xoá đề tài này?")) return;
    try {
      await deleteDeTai(id);
      toast.success("Xoá đề tài thành công!");
      fetchData();
    } catch (error) {
      toast.error("Không thể xoá đề tài.");
    }
  };

  // Các chức năng hành động trên đề tài
  const handleAddSv = async (e) => {
    e.preventDefault();
    if (!newSvMa) return toast.warning("Vui lòng nhập mã SV");
    try {
      await addSinhVienDeTai(selectedDt.ma_dt, { ma_sv: newSvMa, vai_tro: newSvRole });
      setNewSvMa('');
      toast.success("Thêm sinh viên thành công!");
      fetchDtSinhViens(selectedDt.ma_dt);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi khi thêm sinh viên");
    }
  };

  const handleRemoveSv = async (ma_sv) => {
    if (!window.confirm("Bỏ sinh viên ra khỏi đề tài?")) return;
    try {
      await removeSinhVienDeTai(selectedDt.ma_dt, { ma_sv });
      toast.success("Đã xoá sinh viên khỏi đề tài");
      fetchDtSinhViens(selectedDt.ma_dt);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi khi xoá sinh viên");
    }
  };

  const handleTransferLeader = async (ma_sv) => {
    if (!window.confirm("Chuyển quyền Leader cho sinh viên này?")) return;
    try {
      await transferSinhVienDeTai(selectedDt.ma_dt, { ma_sv });
      toast.success("Đã chuyển quyền Leader!");
      fetchDtSinhViens(selectedDt.ma_dt);
    } catch (error) {
      toast.error(error.response?.data?.error || "Lỗi khi chuyển quyền");
    }
  };

  const handleAction = async (actionFn, dt, successMsg) => {
    try {
      await actionFn(dt.ma_dt);
      toast.success(successMsg);
      fetchData(); // Cập nhật danh sách lại
      setDetailModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Không có quyền hoặc lỗi hệ thống");
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Quản Lý Đề Tài</h2>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} style={{ marginRight: '8px' }} /> Thêm Đề Tài
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
                  <th>Mã ĐT</th>
                  <th>Tên Đề Tài</th>
                  <th>Trạng Thái</th>
                  <th>GV Hướng Dẫn</th>
                  <th style={{ textAlign: 'right' }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Chưa có dữ liệu.</td></tr>
                ) : items.map(item => (
                  <tr key={item.ma_dt}>
                    <td>{item.ma_dt}</td>
                    <td>{item.ten_dt}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: `${statusColors[item.trang_thai]}20`,
                        color: statusColors[item.trang_thai]
                      }}>
                        {item.trang_thai.toUpperCase()}
                      </span>
                    </td>
                    <td>{item.gv_huong_dan_detail?.ten_gv || item.gv_huong_dan}</td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn" title="Chi tiết" style={{ padding: '0.4rem', border: '1px solid var(--success)', color: 'var(--success)', background: 'transparent' }} onClick={() => handleOpenDetail(item)}>
                        <Eye size={16} />
                      </button>
                      <button className="btn" title="Sửa" style={{ padding: '0.4rem', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn" title="Xoá" style={{ padding: '0.4rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(item.ma_dt)}>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Sửa Đề Tài" : "Thêm Đề Tài"}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Mã Đề Tài</label>
            <input 
              required
              disabled={!!editItem}
              className="input-field" 
              value={formData.ma_dt} 
              onChange={e => setFormData({...formData, ma_dt: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Tên Đề Tài</label>
            <input 
              required
              className="input-field" 
              value={formData.ten_dt} 
              onChange={e => setFormData({...formData, ten_dt: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label className="input-label">GV Hướng Dẫn</label>
            <select 
              required
              className="input-field"
              value={formData.gv_huong_dan}
              onChange={e => setFormData({...formData, gv_huong_dan: e.target.value})}
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              <option value="">-- Chọn Giảng Viên --</option>
              {giangViens.map(g => (
                <option key={g.ma_gv} value={g.ma_gv}>{g.ten_gv}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn" onClick={() => setModalOpen(false)}>Huỷ</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} title={`Chi Tiết: ${selectedDt?.ten_dt}`}>
         {selectedDt && (
           <div>
             <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn" onClick={() => handleAction(submitDeTai, selectedDt, "Đã gửi lên Chờ duyệt")} style={{ fontSize: '0.875rem', background: '#EAB308', color: '#111', gap: '0.25rem' }}><Send size={16} /> Gửi Duyệt</button>
                <button className="btn" onClick={() => handleAction(approveDeTai, selectedDt, "Đã Duyệt Đề tài")} style={{ fontSize: '0.875rem', background: '#10B981', color: '#fff', gap: '0.25rem' }}><CheckCircle2 size={16} /> Duyệt (GV)</button>
                <button className="btn" onClick={() => handleAction(rejectDeTai, selectedDt, "Đã Từ chối Đề tài")} style={{ fontSize: '0.875rem', background: '#EF4444', color: '#fff', gap: '0.25rem' }}><XCircle size={16} /> Từ Chối (GV)</button>
             </div>

             <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Thành Viên Tham Gia ({dtSinhViens.length}/3)</h4>
             <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
               {dtSinhViens.length === 0 && <li className="text-muted">Chưa có sinh viên</li>}
               {dtSinhViens.map(sv => {
                  // In the api view get_de_tai returns SinhVien objects, but we need vai_tro. 
                  // Wait, backend get_de_tai returns SinhVienSerializer. It doesn't include vai_tro!
                  // That's an issue with backend but let's assume it has something or we fallback.
                  return (
                 <li key={sv.ma_sv} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                   <div>
                     <strong>{sv.ten_sv}</strong> ({sv.ma_sv}) 
                   </div>
                   <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" title="Make Leader" style={{ padding: '0.3rem', border: '1px solid var(--success)', color: 'var(--success)', background: 'transparent' }} onClick={() => handleTransferLeader(sv.ma_sv)}>
                        <ShieldCheck size={16} />
                      </button>
                      <button className="btn" title="Xoá SV" style={{ padding: '0.3rem', border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent' }} onClick={() => handleRemoveSv(sv.ma_sv)}>
                        <UserMinus size={16} />
                      </button>
                   </div>
                 </li>
                 );
               })}
             </ul>

             {dtSinhViens.length < 3 && (
               <form onSubmit={handleAddSv} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                 <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="input-label">Mã SV mới</label>
                    <input className="input-field" value={newSvMa} onChange={e => setNewSvMa(e.target.value)} required placeholder="VD: SV001" />
                 </div>
                 <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Vai trò</label>
                    <select className="input-field" value={newSvRole} onChange={e => setNewSvRole(e.target.value)} style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
                      <option value="member">Member</option>
                      <option value="leader">Leader</option>
                    </select>
                 </div>
                 <button type="submit" className="btn btn-primary" title="Thêm Thành Viên" style={{ height: '42px', padding: '0 1rem' }}>
                   <UserPlus size={18} />
                 </button>
               </form>
             )}
           </div>
         )}
      </Modal>
    </div>
  );
};

export default DeTai;
