import React, { useEffect, useState } from 'react';
import { createUser } from '../../api/UsersAPI';
import { getRoles } from '../../api/RolesAPI';
import { useNavigate } from 'react-router-dom'

const CreateUserForm = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: '',
  });
  const [roles, setRoles] = useState([]); // Danh sách role
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const result = await getRoles();
        if (result.success) {
          setRoles(result.data); // Lưu danh sách role vào state
        }
      } catch (error) {
        console.error('Không thể lấy danh sách vai trò');
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) {
      formData.append(key, form[key]);
    }

    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const result = await createUser(formData);
      if (result.success) {
        navigate('/users');
      } else {
        setMessage('Thất bại: ' + result.message);
      }
    } catch (error) {
      setMessage('Lỗi hệ thống: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h2>Tạo Người Dùng</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="username" type="text" placeholder="Tên đăng nhập" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="fullName" type="text" placeholder="Họ tên" onChange={handleChange} />
        
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">-- Chọn vai trò --</option>
          {roles.map((role) => (
            <option key={role._id} value={role.roleName}>
              {role.roleName}
            </option>
          ))}
        </select>

        <input name="avatar" type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit">Tạo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateUserForm;
