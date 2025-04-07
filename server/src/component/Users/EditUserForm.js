import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser,updateUser } from '../../api/UsersAPI';

const UpdateUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    email: '',
    fullName: '',
    password: '',
    avatar: null,
    currentAvatar: ''
  });
  const [status, setStatus] = useState({
    message: '',
    error: '',
    loading: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setStatus(prev => ({...prev, loading: true}));
        const response = await getUser(id); 
        
        setUser({
          email: response.data.email, 
          fullName: response.data.fullName,
          password: '',
          avatar: null,
          currentAvatar: response.data.avatar || ''
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev, 
          error: error.response?.data?.message || error.message
        }));
      } finally {
        setStatus(prev => ({...prev, loading: false}));
      }
    };
  
    fetchUser();
  }, [id]);

  const handleFileChange = (e) => {
    setUser({...user, avatar: e.target.files[0]});
  };

  const handleChange = (e) => {
    setUser({...user, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
  
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('fullName', user.fullName);
      if (user.password) formData.append('password', user.password);
      if (user.avatar) formData.append('avatar', user.avatar);
  
      const result = await updateUser(id, formData);  // Gọi API updateUser
  
      setStatus({
        loading: false,
        message: 'Cập nhật thành công!',
        error: ''
      });
  
      setTimeout(() => navigate('/users'), 2000);
    } catch (error) {
      setStatus({
        loading: false,
        message: '',
        error: error.message || 'Có lỗi xảy ra khi cập nhật'
      });
    }
  };
  

  return (
    <div>
      <h2>Cập nhật người dùng</h2>
      {status.message && (
        <div className="alert alert-success">{status.message}</div>
      )}
      
      {status.error && (
        <div className="alert alert-danger">{status.error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Họ và tên:</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Avatar:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default UpdateUser;