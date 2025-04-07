import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getCategories = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      params: queries,
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thể loại:', error);
    throw error;
  }
};  

export const createCategory = async (newCategory) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('auth_token');

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      throw new Error('Token không tồn tại, vui lòng đăng nhập lại');
    }

    // Gửi yêu cầu API với token trong header Authorization
    const response = await axios.post(`${API_URL}/categories`, newCategory, {
      headers: {
        'Authorization': `Bearer ${token}`, // Thêm token vào header Authorization
      },
      withCredentials: true
      
    });
    if (response.status !== 200) {
      console.error("Lỗi từ server:", response.data);
    }
    return response.data;
    
  } catch (error) {
    console.error('Lỗi khi tạo thể loại:', error);
    throw error;
  }
};