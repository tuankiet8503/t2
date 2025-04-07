import React, { useState } from 'react';
import { createSale } from '../../api/SaleAPI';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../component/Menu/slidebar';
const AddSale = () => {
  const [saleName, setSaleName] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(''); // Thêm state cho ngày kết thúc
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSale = { saleName, discount, startDate, endDate }; // Gửi thêm endDate

    try {
      await createSale(newSale);
      navigate('/sale'); // Quay lại danh sách Sale sau khi thêm thành công
    } catch (err) {
      setError('Lỗi khi tạo sale mới');
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
          <h2>Thêm Sale Mới</h2>
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
                value={saleName}
                onChange={(e) => setSaleName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="discount" className="form-label">Phần trăm giảm</label>
              <input
                type="number"
                id="discount"
                className="form-control"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="startDate" className="form-label">Ngày bắt đầu</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="endDate" className="form-label">Ngày kết thúc</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </form>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AddSale;
