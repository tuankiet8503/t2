import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../api/ProductAPI';
import { Link } from 'react-router-dom';
import Sidebar from '../../component/Menu/slidebar';
const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}></div>
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📦 Danh sách sản phẩm</h2>
        <Link to="/add-product" className="btn btn-success">
          ➕ Thêm sản phẩm
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle table-bordered shadow-sm">
          <thead className="table-dark">
            <tr className="text-center">
              <th scope="col">Ảnh</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Giá</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="text-center">
                <td>
                  <img
                    src={p.imgURL}
                    alt={p.productName}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </td>
                <td className="fw-semibold">{p.productName}</td>
                <td className="text-success">{p.price.toLocaleString()}₫</td>
                <td>{p.quantity}</td>
                <td>
                  <Link
                    to={`/edit-product${p._id}`}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    ✏️ Sửa
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️ Xoá
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default ProductList;