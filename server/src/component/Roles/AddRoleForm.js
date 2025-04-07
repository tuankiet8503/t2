import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole } from '../../api/RolesAPI'; // Hàm gửi request tới API của bạn

const AddRoleForm = () => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName) {
      setError('Tên quyền là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API để thêm quyền mới
      const newRole = { roleName, description };
      const response = await createRole(newRole);
      if (response && response.success) {
        navigate('/roles');
      } else {
        setError(response.message || 'Không thể thêm quyền');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Thêm quyền mới</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="roleName" className="form-label">Tên quyền</label>
          <input
            type="text"
            id="roleName"
            className="form-control"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô tả</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm quyền'}
        </button>
      </form>
    </div>
  );
};

export default AddRoleForm;
