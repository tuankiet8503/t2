import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Đổi port nếu cần

export const getMenus = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/menu/all`, {
      params: queries,
    });
    return response.data; // Trả về { success, data, message }
  } catch (error) {
    console.error('Lỗi khi lấy menu:', error);
    throw error;
  }
};
export const getMenusslide = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/menu`, {
      params: queries,
    });
    return response.data; // Trả về { success, data, message }
  } catch (error) {
    console.error('Lỗi khi lấy menu:', error);
    throw error;
  }
};
export const createMenu = async (menuData) => {
    try {
      const response = await axios.post(`${API_URL}/menu`, menuData);
      return response.data; // Trả về { success, data, message }
    } catch (error) {
      console.error('Lỗi khi tạo menu:', error);
      throw error;
    }
  };
  export const getMenuById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/menu/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin quyền:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lấy thông tin quyền'
      };
    }
  };
  
  export const updateMenu = async (id, Data) => {
    try {
      const response = await axios.put(`${API_URL}/menu/${id}`, Data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Lỗi khi cập nhật menu:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật menu'
      };
    }
  };