import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getUsers = async (queries = {}) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      params: queries,
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy người dùng:', error);
    throw error;
  }
};

export const getUser = async(userId)=> {
    try {
      const response = await axios.get(`${API_URL}/users/users/${userId}`, {
        withCredentials: true,
      });
      return response.data; 
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      throw error;
    }
  
};


export const createUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true 
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi tạo người dùng:', error);
    throw error;
  }
};

export const updateUser = async (userId, formData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;  // Trả về dữ liệu từ response
  } catch (error) {
    throw error.response?.data || error;
  }
};

