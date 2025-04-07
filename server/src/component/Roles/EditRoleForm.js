import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById, updateRole } from '../../api/RolesAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Spinner, Card, Form, Button, Container, Row, Col } from 'react-bootstrap';

const EditRoleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Load role data khi component mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await getRoleById(id);
        if (response && response.success) {
          const roleData = response.data.data || response.data;
          setRoleName(roleData.roleName || '');
          setDescription(roleData.description || '');
        } else {
          setError('Không tìm thấy quyền');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải dữ liệu quyền');
      } finally {
        setIsLoadingInitial(false);
      }
    };

    fetchRole();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName) {
      setError('Tên quyền là bắt buộc');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await updateRole(id, { roleName, description });

      if (response && response.success) {
        navigate('/roles'); // Chuyển hướng sau khi cập nhật thành công
      } else {
        setError(response.message || 'Không thể cập nhật quyền');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingInitial) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0 text-center">Chỉnh sửa quyền</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Tên quyền <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                    placeholder="Nhập tên quyền"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả cho quyền này..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/roles')}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="d-flex align-items-center"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2 me-2"></i>
                        Cập nhật
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditRoleForm;