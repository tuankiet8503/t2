import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Đổi nếu backend bạn dùng port khác

// Hàm lấy token
const getToken = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Token không tồn tại, vui lòng đăng nhập lại');
  }
  return token;
};

// Lấy danh sách sản phẩm trong giỏ hàng
export const getCartItems = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}/cartitems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (ProductId, Quantity) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/cartitems`, { ProductId, Quantity }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    throw error;
  }
};

// Cập nhật số lượng
export const updateCartItem = async (ProductId, newQuantity) => {
  try {
    const token = getToken();
    const response = await axios.post(`${API_URL}/update`, { ProductId, newQuantity }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng:', error);
    throw error;
  }
};

// Xoá sản phẩm khỏi giỏ
export const deleteCartItem = async (ProductId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ProductId }, // axios DELETE cần gửi data trong `data`
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xoá sản phẩm trong giỏ hàng:', error);
    throw error;
  }
};