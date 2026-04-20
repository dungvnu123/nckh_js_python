import React, { useState, useEffect } from 'react';
import { getDashboardStats, getDeTaiStats } from '../api/services';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BookOpen, Users, UserCheck, CheckCircle, Clock } from 'lucide-react';

const COLORS = {
  'draft': '#94A3B8',
  'pending': '#F59E0B',
  'approved': '#10B981',
  'rejected': '#EF4444'
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    tong_detai: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    tong_sinh_vien: 0,
    tong_giang_vien: 0,
  });
  const [advStats, setAdvStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [dashRes, advRes] = await Promise.all([
          getDashboardStats(),
          getDeTaiStats()
        ]);
        setStats(dashRes.data);
        
        // Transform advStats for Recharts
        const formattedAdvStats = {
          ...advRes.data,
          theo_trang_thai: advRes.data.theo_trang_thai.map(item => ({
            name: item.trang_thai.toUpperCase(),
            value: item.so_luong,
            color: COLORS[item.trang_thai] || '#8884d8'
          })),
          top_giang_vien_huong_dan: advRes.data.top_giang_vien_huong_dan.map(item => ({
            name: item.gv_huong_dan__ten_gv,
            Đề_tài: item.so_luong
          }))
        };
        setAdvStats(formattedAdvStats);

      } catch (err) {
        setError('Không thể tải dữ liệu Dashboard. Vui lòng kiểm tra Server!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="container text-center mt-8">Đang tải dữ liệu...</div>;
  if (error) return <div className="container text-center mt-8 text-error">{error}</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h2>Dashboard Thống Kê</h2>
          <p>Trang tổng quan về hệ thống Quản lý NCKH</p>
        </div>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)' }}>
            <BookOpen size={32} />
          </div>
          <div>
            <div className="stat-label">Tổng Đề Tài</div>
            <div className="stat-value" style={{ marginTop: '0.2rem', fontSize: '2rem' }}>{stats.tong_detai}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--success)' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <div className="stat-label">Đã Duyệt</div>
            <div className="stat-value" style={{ marginTop: '0.2rem', fontSize: '2rem' }}>{stats.approved}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3B82F6' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%', color: '#3B82F6' }}>
            <Users size={32} />
          </div>
          <div>
            <div className="stat-label">Sinh Viên</div>
            <div className="stat-value" style={{ marginTop: '0.2rem', fontSize: '2rem' }}>{stats.tong_sinh_vien}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: '50%', color: '#8B5CF6' }}>
            <UserCheck size={32} />
          </div>
          <div>
            <div className="stat-label">Giảng Viên</div>
            <div className="stat-value" style={{ marginTop: '0.2rem', fontSize: '2rem' }}>{stats.tong_giang_vien}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {advStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pie Chart */}
          <div className="glass-card">
             <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Tỉ lệ Trạng thái Đề Tài</h3>
             <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={advStats.theo_trang_thai}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {advStats.theo_trang_thai.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                       itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {advStats.theo_trang_thai.map((item, idx) => (
                   <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }}></div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{item.name} ({item.value})</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card">
             <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>Top Giảng Viên Hướng Dẫn</h3>
             <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={advStats.top_giang_vien_huong_dan} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="var(--text-muted)" />
                    <YAxis dataKey="name" type="category" width={120} stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                       cursor={{fill: 'rgba(255,255,255,0.05)'}}
                       contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="Đề_tài" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Dashboard;
