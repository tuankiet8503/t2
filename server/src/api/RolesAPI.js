import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Đổi port nếu cần

export const getRoles = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/roles`, {
      params: queries,
    });
    return response.data; // Trả về { success, data, message }
  } catch (error) {
    console.error('Lỗi khi lấy role:', error);
    throw error;
  }
};

export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${API_URL}/roles`, roleData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi thêm quyền:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Đã xảy ra lỗi khi thêm quyền'
    };
  }
};

export const updateRole = async (id, roleData) => {
  try {
    const response = await axios.put(`${API_URL}/roles/${id}`, roleData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Lỗi khi cập nhật quyền:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật quyền'
    };
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${id}`);
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