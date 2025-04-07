// Client/components/CartItem.js
import React, { useEffect, useState } from 'react';
import { getCartItems } from '../../api/CartItemAPI';

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItems();
        setCartItems(data);
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  if (loading) return <div>Đang tải giỏ hàng...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn</h2>
      {cartItems.length === 0 ? (
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">STT</th>
              <th className="p-2 border">Tên sản phẩm</th>
              <th className="p-2 border">Số lượng</th>
              <th className="p-2 border">Giá</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item._id}>
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border">{item.ProductId?.name || 'Không rõ'}</td>
                <td className="p-2 border text-center">{item.Quantity}</td>
                <td className="p-2 border text-right">{item.Price?.toLocaleString()} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CartItem;
