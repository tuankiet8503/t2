import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Hàm lấy danh sách sale với các tham số truy vấn
export const getSales = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/sale`, {
      params: queries,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sale:', error);
    throw error;
  }
};
export const deleteSale = async (saleId) => {
    try {
      const response = await axios.delete(`${API_URL}/sale/${saleId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa sale:', error);
      throw error;
    }
  };
// Hàm tạo mới một sale
export const createSale = async (newSale) => {
  const response = await axios.post(`${API_URL}/sale`, newSale);
  if (response.status !== 200) {
    console.error("Lỗi từ server:", response.data);
  }
  return response.data;
};

// Hàm lấy thông tin sale theo ID
export const getSaleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/sale/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sale với ID ${id}:`, error);
    throw error;
  }
};
export const updateSale = async (saleId, saleData) => {
    try {
      const response = await axios.put(`${API_URL}/sale/${saleId}`, saleData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật sale:', error);
      throw error;
    }
  };
  