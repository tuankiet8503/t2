import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Sử dụng useParams từ React Router
import { updateMenu } from '../../api/MenuAPI'; 
import { getMenus, getMenuById } from '../../api/MenuAPI'; 

const EditMenuForm = () => {
  const { menuId } = useParams(); // Sử dụng useParams để lấy menuId từ URL
  const [menuText, setMenuText] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [parentMenu, setParentMenu] = useState('');
  const [parentMenus, setParentMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Lấy danh sách menu cha khi component load
  useEffect(() => {
    console.log('id',menuId);
    const fetchParentMenus = async () => {
      try {
        const menus = await getMenus(); // Lấy tất cả các menu
        setParentMenus(menus.data); // Cập nhật danh sách menu cha
      } catch (error) {
        console.error('Lỗi khi lấy menu cha:', error);
        setError('Lỗi khi tải dữ liệu menu cha.');
      }
    };

    const fetchMenuDetails = async () => {
      try {
        const response = await getMenuById(menuId); // Lấy thông tin menu cần sửa
        const menu = response.data.data;
        console.log('Menu Details:', menu);
        setMenuText(menu.text); // Điền vào các trường
        setMenuUrl(menu.url);
        setParentMenu(menu.parent || ''); // Nếu có parent thì điền, không thì để trống
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết menu:', error);
        setError('Lỗi khi tải chi tiết menu.');
      } finally {
        setLoading(false);
      }
    };

    fetchParentMenus();
    fetchMenuDetails();
  }, [menuId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedMenu = {
      text: menuText,
      url: menuUrl,
      parent: parentMenu || null // Nếu không có parent, sẽ là null
    };

    try {
      const result = await updateMenu(menuId, updatedMenu); // Gọi API updateMenu
      console.log('Menu đã được cập nhật:', result.data);
      navigate('/menu');
    } catch (error) {
      console.error('Lỗi khi cập nhật menu:', error);
      // Xử lý lỗi nếu có
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi dữ liệu đang tải
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tên menu:</label>
        <input 
          type="text" 
          value={menuText}
          onChange={(e) => setMenuText(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>URL:</label>
        <input 
          type="text" 
          value={menuUrl}
          onChange={(e) => setMenuUrl(e.target.value)}
          required 
        />
      </div>
      <div>
        <label>Menu cha (tuỳ chọn):</label>
        <select 
          value={parentMenu} 
          onChange={(e) => setParentMenu(e.target.value)}
        >
          <option value="">Chọn menu cha</option>
          {parentMenus.map(menu => (
            <option key={menu._id} value={menu._id}>
              {menu.text}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Cập nhật menu</button>
    </form>
  );
};

export default EditMenuForm;
