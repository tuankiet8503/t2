import React, { useState, useEffect } from 'react';
import { createMenu } from '../../api/MenuAPI';
import { getMenus } from '../../api/MenuAPI';
import { useNavigate } from 'react-router-dom';

const CreateMenuForm = () => {
  const [menuText, setMenuText] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [parentMenu, setParentMenu] = useState('');
  const [parentMenus, setParentMenus] = useState([]); // Lưu danh sách menu cha
  const navigate = useNavigate();
  // Lấy danh sách menu cha khi component load
  useEffect(() => {
    const fetchParentMenus = async () => {
      try {
        const menus = await getMenus();
        setParentMenus(menus.data);
      } catch (error) {
        console.error('Lỗi khi lấy menu cha:', error);
      }
    };

    fetchParentMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMenu = {
      text: menuText,
      url: menuUrl,
      parent: parentMenu || null
    };

    try {
      const result = await createMenu(newMenu);
      console.log('Menu đã được tạo:', result.data);
      navigate('/menu');
    } catch (error) {
      console.error('Lỗi khi tạo menu:', error);
      // Xử lý lỗi nếu có
    }
  };

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
      <button type="submit">Tạo menu</button>
    </form>
  );
};

export default CreateMenuForm;
