import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await forgotPassword(email);
    
    if (result.success) {
      toast.success(result.message);
      setSubmitted(true);
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2>Quên mật khẩu</h2>
          <p>Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
            </button>
          </form>
        ) : (
          <div className="text-center" style={{ padding: '1rem' }}>
            <p className="text-success mb-6">Yêu cầu đã được gửi! Vui lòng kiểm tra email của bạn (hoặc console ở backend).</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Quay lại Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
