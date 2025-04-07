import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSaleById, updateSale } from '../../api/SaleAPI'; // Đảm bảo có hàm updateSale
import Sidebar from '../../component/Menu/slidebar';
const EditSale = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [sale, setSale] = useState({ saleName: '', discount: '', startDate: '', endDate: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await getSaleById(id);
        setSale(response.data); // Điền dữ liệu vào form
      } catch (err) {
        setError('Không thể lấy thông tin sale');
      }
    };
    fetchSale();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateSale(id, sale); // Gọi API để cập nhật thông tin sale
      navigate('/sale'); // Quay lại danh sách sale
    } catch (err) {
      setError('Lỗi khi cập nhật sale');
    }
  };

  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h2>Sửa Sale</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="saleName" className="form-label">Tên chương trình</label>
              <input
                type="text"
                id="saleName"
                className="form-control"
                value={sale.saleName}
                onChange={(e) => setSale({ ...sale, saleName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="discount" className="form-label">Phần trăm giảm</label>
              <input
                type="number"
                id="discount"
                className="form-control"
                value={sale.discount}
                onChange={(e) => setSale({ ...sale, discount: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={sale.startDate}
                onChange={(e) => setSale({ ...sale, startDate: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={sale.endDate}
                onChange={(e) => setSale({ ...sale, endDate: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Cập nhật</button>
          </form>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default EditSale;
