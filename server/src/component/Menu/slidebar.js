import React, { useEffect, useState } from 'react';
import { getMenusslide } from '../../api/MenuAPI'; // Đảm bảo bạn đã tạo API
import './Sidebar.css'; // Import CSS vào

const Sidebar = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm đệ quy để tạo menu phân cấp
  const renderMenu = (menuList) => {
    return menuList.map(menu => (
      <li key={menu._id} className={menu.children && menu.children.length > 0 ? 'has-children' : ''}>
        <a href={menu.url} onClick={(e) => handleMenuClick(e, menu)}>{menu.text}</a>
        {menu.children && menu.children.length > 0 && (
          <ul>
            {renderMenu(menu.children)}
          </ul>
        )}
      </li>
    ));
  };

  // Hàm xử lý sự kiện click để mở/đóng menu con
  const handleMenuClick = (e, menu) => {
    if (menu.children && menu.children.length > 0) {
      e.preventDefault(); // Ngừng chuyển trang khi click vào menu cha
      const li = e.target.closest('li');
      li.classList.toggle('open'); // Thêm hoặc xóa class open để mở/đóng menu con
    }
  };

  // Lấy danh sách menu khi component mount
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getMenusslide();
        setMenus(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar">
      <ul>
        {renderMenu(menus)}
      </ul>
    </div>
  );
};

export default Sidebar;
