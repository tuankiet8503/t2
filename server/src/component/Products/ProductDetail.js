import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/ProductAPI';
import Sidebar from '../../component/Menu/slidebar';
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
          
        // Kiểm tra cấu trúc response
        const productData = response.data?.data || response.data;
        
        if (!productData) {
          throw new Error('Sản phẩm không tồn tại');
        }
        
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Kiểm tra loading/error trước
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>; // Thêm dòng này

  // Chỉ render khi có product
  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}>
    <div>
      <h2>Thông tin sản phẩm</h2>
      <p>Giá: {product.price?.toLocaleString('vi-VN')} VND</p>
      <p>Số lượng: {product.quantity}</p>
      <p>Danh mục: {product.category}</p>
      <img src={product.imgURL} alt={product.productName} width="200" />
      <p>Giảm giá: {product.sale}%</p>
      </div>
    </div>
    </div>
  );
};

export default ProductDetail;