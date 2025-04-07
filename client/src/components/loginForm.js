import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/AuthAPI'; // Hàm gửi request tới API của bạn

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Tên đăng nhập và mật khẩu là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API đăng nhập
      const credentials = { username, password };
      const response = await loginUser(credentials);
      if (response && response.success) {
        // Chuyển hướng tới trang dashboard nếu đăng nhập thành công
        navigate('/categories'); // Thay đổi đường dẫn này nếu cần
      } else {
        setError(response.message || 'Sai tên đăng nhập hoặc mật khẩu.');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Đăng Nhập</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
