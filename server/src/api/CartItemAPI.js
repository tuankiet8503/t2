import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Hàm lấy token từ localStorage
const getToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Token không tồn tại. Vui lòng đăng nhập.');
  }
  return token;
};

// Lấy tất cả sản phẩm trong giỏ hàng
export const getCartItems = async () => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/cartitem/cartitems`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  });
  return res.data;
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (ProductId, Quantity) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/cartitem/cartitems`, {
    ProductId,
    Quantity
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  });
  return res.data;
};

// Cập nhật số lượng
export const updateCartItem = async (ProductId, newQuantity) => {
  const token = getToken();
  const res = await axios.post(`${API_URL}/update`, {
    ProductId,
    newQuantity
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  });
  return res.data;
};

// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItem = async (ProductId) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      ProductId
    },
    withCredentials: true
  });
  return res.data;
};
