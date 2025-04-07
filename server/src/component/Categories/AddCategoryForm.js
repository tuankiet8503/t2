import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../api/CategoriesAPI'; // Giả sử hàm createCategory nằm trong file CategoryAPI.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../component/Menu/slidebar';
const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setError('Tên thể loại là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
        const newCategory = { categoryName, description, };
      const response = await createCategory(newCategory);

      if (response.success) {
        setSuccessMessage('Thể loại đã được tạo thành công!');
        setCategoryName('');
        setDescription('');
        navigate('/categories'); // Điều hướng về trang danh sách thể loại sau khi tạo thành công
      } else {
        setError(response.message || 'Không thể tạo thể loại');
      }
    } catch (err) {
      // Kiểm tra mã lỗi và hiển thị thông báo cụ thể
      if (err.response && err.response.status === 403) {
        setError('Bạn không có quyền truy cập vào đây.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}></div>
    <div className="container mt-4">
      <h2 className="text-center mb-4">Tạo thể loại mới</h2>

      {error && <p className="text-danger text-center">{error}</p>}
      {successMessage && <p className="text-success text-center">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">Tên thể loại</label>
          <input
            type="text"
            id="categoryName"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
          {loading ? 'Đang tạo...' : 'Tạo thể loại'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateCategory;
