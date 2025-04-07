import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/ProductAPI';
import { getCategories } from '../../api/CategoriesAPI'; // API lấy danh sách danh mục
import { getSales } from '../../api/SaleAPI'; // API lấy danh sách chương trình giảm giá
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../../component/Menu/slidebar';
const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sale, setSale] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  // Lấy danh sách danh mục và chương trình giảm giá
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Promise.all([
          getCategories(),
          getSales(),
        ]);
  
        // Lấy mảng sales từ response[1] (response[0] là danh mục)
        const saleData = response[1]?.data || []; // Truy cập vào thuộc tính `data` để lấy mảng giảm giá
        if (Array.isArray(saleData)) {
          setSales(saleData);
        } else {
          setSales([]); // Nếu không phải mảng, trả về mảng rỗng
          console.error('Dữ liệu giảm giá không hợp lệ', saleData);
        }
  
        setCategories(response[0]); // Lưu danh mục
      } catch (err) {
        console.error('Lỗi khi tải danh mục và chương trình giảm giá:', err);
      }
    };
  
    fetchData();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !price || !quantity || !category || !avatar) {
      setError('Tất cả các trường là bắt buộc!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const data = new FormData();
    data.append('productName', productName);
    data.append('price', price);
    data.append('quantity', quantity);
    data.append('description', description);
    data.append('category', category);
    data.append('sale', sale);
    data.append('avatar', avatar);

    try {
      const response = await createProduct(data);

      if (response.success) {
        setSuccessMessage('Sản phẩm đã được thêm thành công!');
        setProductName('');
        setPrice('');
        setQuantity('');
        setDescription('');
        setCategory('');
        setSale('');
        setAvatar(null);
        navigate('/product-list'); // Điều hướng về trang danh sách sản phẩm sau khi tạo thành công
      } else {
        setError(response.message || 'Không thể thêm sản phẩm');
      }
    } catch (err) {
      // Kiểm tra mã lỗi và hiển thị thông báo cụ thể
      if (err.response && err.response.status === 403) {
        setError('Bạn không có quyền truy cập vào đây.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
    <div className="sidebar-container">
      <Sidebar /> {/* Gọi Sidebar */}
    </div>
    <div style={{ marginLeft: '250px', padding: '20px', flexGrow: 1 }}></div>
    <div className="container mt-4">
      <h2 className="text-center mb-4">Thêm sản phẩm</h2>

      {error && <p className="text-danger text-center">{error}</p>}
      {successMessage && <p className="text-success text-center">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            id="productName"
            className="form-control"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Giá</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Số lượng</label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô tả</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Combobox cho danh mục */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Danh mục</label>
          <select
            id="category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
            ))}
          </select>
        </div>

        {/* Combobox cho giảm giá */}
        <div className="mb-3">
          <label htmlFor="sale" className="form-label">Chương trình giảm giá</label>
          <select
            id="sale"
            className="form-control"
            value={sale}
            onChange={(e) => setSale(e.target.value)}
          >
            <option value="">Chọn chương trình giảm giá (nếu có)</option>
            {Array.isArray(sales) && sales.map((s) => (
              <option key={s._id} value={s.saleName}>{s.saleName}</option>
            ))}
          </select>
        </div>

        {/* Chọn ảnh đại diện */}
        <div className="mb-3">
          <label htmlFor="avatar" className="form-label">Ảnh đại diện</label>
          <input
            type="file"
            id="avatar"
            className="form-control"
            onChange={(e) => setAvatar(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
