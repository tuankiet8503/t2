import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Đổi port nếu cần

export const getProducts = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: queries // Truyền query params nếu có
    });
    return response.data; // Trả về { success, data, message }
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data; // Trả về { success, data, message }
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    throw error;
  }
};