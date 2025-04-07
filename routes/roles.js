
var express = require('express');
var router = express.Router();
let roleSchema = require('../models/roles');

router.get('/', async function(req, res, next) {
  try {
    // Lấy danh sách roles từ cơ sở dữ liệu
    let roles = await roleSchema.find({});

    // Kiểm tra nếu không có roles nào trong cơ sở dữ liệu
    if (!roles || roles.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Không tìm thấy quyền nào.'
      });
    }

    // Trả về danh sách quyền nếu thành công
    res.status(200).send({
      success: true,
      data: roles
    });
  } catch (error) {
    // Xử lý lỗi và gửi phản hồi cho client
    console.error("Lỗi khi lấy roles:", error);
    res.status(500).send({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách quyền.'
    });
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let role = await roleSchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    const { roleName, description = '' } = req.body;
    
    if (!roleName) {
      return res.status(400).json({ 
        success: false,
        message: 'Tên quyền là bắt buộc'
      });
    }

    const newRole = new roleSchema({
      roleName,
      description
    });

    await newRole.save();
    
    res.status(201).json({
      success: true,
      data: newRole
    });
  } catch (error) {
    console.error('Lỗi khi thêm quyền:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi thêm quyền'
    });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let role = await roleSchema.findByIdAndUpdate(req.params.id,
      body, { new: true }
    );
    res.status(200).send({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    });
  }
});

module.exports = router;