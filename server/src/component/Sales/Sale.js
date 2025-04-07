import React, { useEffect, useState } from 'react';
import { getSales } from '../../api/SaleAPI';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../component/Menu/slidebar';
const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getSales();
        console.log('Dữ liệu sale:', response);
        setSales(response.data);
      } catch (err) {
        setError('Không thể tải danh sách sale');
        console.error('Lỗi khi lấy sale:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '500px', marginTop: '50px' }}>
        {error}
      </div>
    );
  }

  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Danh sách Sale</h2>
            <Link to="/sale-add" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Thêm Sale
            </Link>
          </div>
        </div>

        <div className="card-body">
          {sales.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">Không có sale nào được tìm thấy</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
              <thead className="table-light">
  <tr>
    <th width="5%">#</th>
    <th width="30%">Tên chương trình</th>
    <th width="25%">Phần trăm giảm</th>
    <th width="20%">Ngày bắt đầu</th>
    <th width="20%">Ngày kết thúc</th> {/* Thêm cột này */}
    <th width="20%" className="text-end">Hành động</th>
  </tr>
</thead>

<tbody>
  {sales.map((sale, index) => (
    <tr key={sale._id || index}>
      <td>{index + 1}</td>
      <td><strong>{sale.saleName}</strong></td>
      <td>{sale.discount}%</td>
      <td>{new Date(sale.startDate).toLocaleDateString()}</td>
      <td>{new Date(sale.endDate).toLocaleDateString()}</td> {/* Thêm ngày kết thúc */}
      <td className="text-end">
        <div className="d-flex justify-content-end gap-2">
          <Link to={`/sale-edit/${sale._id}`} className="btn btn-sm btn-outline-primary">
            <i className="bi bi-pencil-square me-1"></i>Sửa
          </Link>
          <button className="btn btn-sm btn-outline-danger" onClick={() => {/* Xử lý xóa */ }}>
            <i className="bi bi-trash me-1"></i>Xóa
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default SaleList;
