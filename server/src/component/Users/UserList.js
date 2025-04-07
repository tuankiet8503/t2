import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/UsersAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUsers(); // Gọi API
        if (result.success) {
          setUsers(result.data); // Cập nhật state nếu thành công
        } else {
          setError(result.message || 'Không thể tải danh sách người dùng');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-danger text-center">Lỗi: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Danh sách người dùng</h2>
      <Link to="/add-user" className="btn btn-primary mb-3">
        + Thêm người dùng
      </Link>
      {users.length === 0 ? (
        <p className="text-center">Không có người dùng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.username || 'Không có tên'}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.roleName || 'Chưa xác định'}</td>
                  <td>
                    <Link to={`/edit-user/${user._id}`} className="btn btn-warning btn-sm me-2">
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
