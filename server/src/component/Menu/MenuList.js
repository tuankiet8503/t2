import React, { useEffect, useState } from 'react';
import { getMenus } from '../../api/MenuAPI';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuList = () => {
    const [Menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await getMenus();
                console.log('Dữ liệu trả về:', response);
                setMenus(response.data);
            } catch (err) {
                setError('Không thể tải danh sách thể loại. Vui lòng thử lại sau.');
                console.error('Lỗi khi lấy danh sách thể loại:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} menu="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '500px', marginTop: '50px' }}>
                {error}
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Danh sách menu</h2>
                        <Link to="/add-menu" className="btn btn-primary">
                            <i className="bi bi-plus-circle me-2"></i>
                            Thêm menu
                        </Link>
                    </div>
                </div>

                <div className="card-body">
                    {Menus.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-folder-x text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3 text-muted">Không có menu nào được tìm thấy</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th width="5%">#</th>
                                        <th width="25%">Tên menu</th>
                                        <th width="50%">Mô tả</th>
                                        <th width="50%">Thuộc</th>
                                        <th width="20%" className="text-end">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Menus.map((menu, index) => {
                                        console.log('Menu:', menu);
                                        return (
                                            <tr key={menu._id || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <strong>{menu.text}</strong>
                                                </td>
                                                <td>
                                                    <p className="text-muted mb-0">{menu.url || 'Không có mô tả'}</p>
                                                </td>
                                                <td>
                                                <strong>{menu.parent}</strong>
                                                </td>
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <Link to={`/edit-menu/${menu._id}`} className="btn btn-sm btn-outline-primary">
                                                            <i className="bi bi-pencil-square me-1"></i>
                                                            Sửa
                                                        </Link>
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => {/* Xử lý xóa */ }}>
                                                            <i className="bi bi-trash me-1"></i>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuList;