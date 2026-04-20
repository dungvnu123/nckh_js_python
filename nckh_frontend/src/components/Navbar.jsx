import { Link, useLocation } from 'react-router-dom';
import { logout } from '../api/auth';
import { LayoutDashboard, Building2, School, Users, GraduationCap, FileText, LogOut, Beaker } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Beaker size={24} /> NCKH API
        </h3>
        <div className="nav-links ml-8">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/khoa" className={`nav-link ${location.pathname === '/khoa' ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Building2 size={18} /> Khoa
          </Link>
          <Link to="/bomon" className={`nav-link ${location.pathname === '/bomon' ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <School size={18} /> Bộ Môn
          </Link>
          <Link to="/giangvien" className={`nav-link ${location.pathname === '/giangvien' ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Users size={18} /> Giảng viên
          </Link>
          <Link to="/sinhvien" className={`nav-link ${location.pathname === '/sinhvien' ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <GraduationCap size={18} /> Sinh viên
          </Link>
          <Link to="/detai" className={`nav-link ${location.pathname === '/detai' || location.pathname.startsWith('/detai/') ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FileText size={18} /> Đề tài
          </Link>
        </div>
      </div>
      <div>
        <button onClick={logout} className="btn" style={{ background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
