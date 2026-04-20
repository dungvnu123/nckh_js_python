import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(username, email, password);
    
    if (result.success) {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2>Đăng ký tài khoản</h2>
          <p>Tạo tài khoản mới cho hệ thống NCKH</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label" htmlFor="username">Tên đăng nhập</label>
            <input 
              id="username"
              type="text" 
              className="input-field" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              className="input-field" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Mật khẩu</label>
            <input 
              id="password"
              type="password" 
              className="input-field" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>

          <div className="text-center">
            <p style={{ fontSize: '0.9rem' }}>
              Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Đăng nhập</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
