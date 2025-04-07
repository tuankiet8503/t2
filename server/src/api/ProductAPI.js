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
// Thêm sản phẩm mới (dùng FormData)
export const createProduct = async (formData) => {
  try { // Lấy token từ localStorage
    const token = localStorage.getItem('auth_token');

    // Kiểm tra xem token có tồn tại không
    if (!token) {
      throw new Error('Token không tồn tại, vui lòng đăng nhập lại');
    }
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo thể loại:', error);
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, formData) => {
  const response = await axios.put(`${API_URL}/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Xóa sản phẩm (soft delete)
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};
export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/category`);
    return response.data;
  };
  
  export const getSales = async () => {
    const response = await axios.get(`${API_URL}/sale`);
    return response.data;
  };
  