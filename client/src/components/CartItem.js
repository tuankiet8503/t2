import React, { useEffect, useState } from 'react';
import { getCartItems, updateCartItem, deleteCartItem } from '../api/CartItemAPI';

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data);
    } catch (err) {
      setError('Không thể tải giỏ hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (ProductId, newQuantity) => {
    try {
      await updateCartItem(ProductId, newQuantity);
      fetchCart(); // cập nhật lại danh sách sau khi thay đổi
    } catch (err) {
      alert('Không thể cập nhật số lượng.');
    }
  };

  const handleDelete = async (ProductId) => {
    try {
      await deleteCartItem(ProductId);
      fetchCart();
    } catch (err) {
      alert('Không thể xoá sản phẩm.');
    }
  };

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h3 className="my-4">Giỏ hàng của bạn</h3>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Tổng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item._id}>
                <td>{item.ProductId?.productName || 'Không có tên'}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.Quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.ProductId._id, parseInt(e.target.value))
                    }
                  />
                </td>
                <td>{item.Price.toLocaleString('vi-VN')} đ</td>
                <td>{(item.Price * item.Quantity).toLocaleString('vi-VN')} đ</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.ProductId._id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CartItem;