import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/productAPI';
import { Link } from 'react-router-dom';
// Đảm bảo import Bootstrap 5 trong file App.js hoặc index.js
 import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Đang tải...</span>
      </div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center p-4 bg-light border rounded">
      <div className="d-flex align-items-center justify-content-center bg-danger text-white rounded-circle mx-auto mb-3" style={{width: "50px", height: "50px"}}>!</div>
      <p className="text-danger">Đã xảy ra lỗi: {error}</p>
      <button className="btn btn-danger" onClick={() => window.location.reload()}>Thử lại</button>
    </div>
  );
  
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 position-relative">
        Danh sách sản phẩm
        <div className="border-bottom border-3 border-primary mx-auto mt-2" style={{width: "60px"}}></div>
      </h2>
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center p-4 bg-light rounded">
          <p className="text-muted">Không tìm thấy sản phẩm nào</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="col">
              <div className="card h-100 shadow-sm">
                {product.imgURL && (
                  <div className="overflow-hidden">
                    <img 
                      src={product.imgURL} 
                      alt={product.productName} 
                      className="card-img-top"
                      style={{height: "200px", objectFit: "cover", transition: "transform 0.5s ease"}}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  {product.price && (
                    <p className="card-text text-primary fw-bold">{product.price.toLocaleString('vi-VN')} đ</p>
                  )}
                  {product.description && (
                    <p className="card-text text-muted text-truncate">{product.description}</p>
                  )}
                  <Link to={`/product/${product._id}`} className="btn btn-primary w-100">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;