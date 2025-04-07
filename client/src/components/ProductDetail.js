import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/productAPI';

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
    <div>
      <h1>{product.productName}</h1>
      <p>{product.description}</p>
      <p>{product.price?.toLocaleString('vi-VN')} VND</p>
    </div>
  );
};

export default ProductDetail;