import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);

    if (response.data.success) {
      // Lưu token vào localStorage
      localStorage.setItem('auth_token', response.data.data); // Lưu token vào localStorage
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    throw error;
  }
};
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    if (response.data.success) {
      console.log('Đăng ký thành công:', response.data.data);
    }
    if (response.status !== 200) {
      console.error("Lỗi từ server:", response.data);
    }
    return response.data;
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi API
  }
};
