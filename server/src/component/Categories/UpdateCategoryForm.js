import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, updateCategory } from '../../api/CategoriesAPI'; // cần định nghĩa các API này
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(id);
        const roleData = response.data.data || response.data;
        if (response.success) {
          setCategoryName(roleData.categoryName);
          setDescription(roleData.description);
        } else {
          setError('Không thể tải dữ liệu thể loại.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      }
    };

    fetchCategory();
  }, [id]);

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
      const response = await updateCategory(id, { categoryName, description });

      if (response.success) {
        setSuccessMessage('Cập nhật thể loại thành công!');
        navigate('/categories'); // quay về danh sách
      } else {
        setError(response.message || 'Không thể cập nhật thể loại');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('Bạn không có quyền thực hiện hành động này.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Cập nhật thể loại</h2>

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
          {loading ? 'Đang cập nhật...' : 'Cập nhật thể loại'}
        </button>
      </form>
    </div>
  );
};

export default UpdateCategory;
