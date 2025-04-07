import React, { useState } from 'react';
import { signupUser } from '../../api/AuthAPI'; // Giả sử signupUser nằm trong file AuthAPI.js

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường bắt buộc có giá trị
    if (!username || !password || !email) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userData = { username, password, email };
      const response = await signupUser(userData);

      if (response.success) {
        setSuccessMessage('Đăng ký thành công!');
        setUsername('');
        setPassword('');
        setEmail('');
      } else {
        setError(response.message || 'Không thể đăng ký');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên người dùng:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
