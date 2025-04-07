const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')
let productController = require('../controllers/products')
let BuildQueies = require('../Utils/BuildQuery')
let { check_authentication,
  check_authorization } = require('../Utils/check_auth')
  let constants = require('../Utils/constants')
  let multer = require('multer')
  let path = require('path')
  let URLCDN_post = "http://localhost:4000/upload";
  let axios = require('axios');
  let FormData = require('form-data');
  let fs = require('fs');
  const { header } = require('express-validator');
// routes/products.js
router.get('/', async (req, res, next) => {
  try {
    let queries = req.query;
    let products = await productSchema.find({}).populate("category");
    
    // Trả về JSON chuẩn với status 200
    res.status(200).json({
      success: true,
      data: products,
      message: "Lấy danh sách sản phẩm thành công"
    });
  } catch (error) {
    // Xử lý lỗi
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});


let avatarDir = path.join(__dirname, '../avatars')
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, avatarDir),
    filename: (req, file, cb) => cb(null,
      (new Date(Date.now())).getTime() + "-" + file.originalname
    ),
  })
  let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image/)) {
        return cb(new Error('loi'));
      }
      console.log("hehehe");
      cb(null, true);
    }, limits: {
      fileSize: 5 * 1024 * 1024
    }
  });

router.post('/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  upload.single('avatar'),
  async function (req, res, next) {
    try {

      let body = req.body;
      if (!req.file) {
        res.status(404).send({
          success: false,
          message: "file khong ton tai"
        })
      }else{
           // **Upload ảnh lên server khác**
          let filePath = path.join(avatarDir, req.file.filename);
          let formData = new FormData();
          console.log("📌 File đã lưu vào:", filePath);
          if (!fs.existsSync(filePath)) {
            console.error("❌ Lỗi: File không tồn tại sau khi upload.");
            return res.status(500).send({ success: false, message: "Lỗi lưu file" });
          }
          formData.append('avatar', fs.createReadStream(filePath));
          let uploadResponse = await axios.post(
            URLCDN_post, 
            formData, 
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          // Xóa file sau khi upload
          fs.unlinkSync(filePath);
          // URL ảnh từ server CDN
          let imageUrl = uploadResponse.data.url;
          let result = await productController.createProducts(
            body.productName,
            body.price,
            body.quantity,
            body.description,
            imageUrl,
            body.category,
            body.sale,
          )
          res.status(200).send({
            success: true,
            data: result
          })
      }    
    } catch (error) {
      console.error("🔥 LỖI CHI TIẾT:", error.response?.data || error.message, error.stack);
      res.status(500).send({ 
        success: false, 
        message: error.response?.data?.message || error.message 
      });
    }
    
  });
  router.put('/:id',
    check_authentication,
    check_authorization(constants.MOD_PERMISSION),
    upload.single('avatar'),
    async function(req, res, next) {
      try {
        let body = req.body;
        let product = await productSchema.findById(req.params.id);
        if (!product) {
          return res.status(404).send({
            success: false,
            message: "Sản phẩm không tồn tại"
          });
        }
  
        // Danh sách các trường được cập nhật
        let allowFields = ["productName", "price","quantity", "description", "category"];
        for (const key of Object.keys(body)) {
          if (allowFields.includes(key)) {
            product[key] = body[key];
          }
        }
  
        // Nếu có ảnh mới thì xử lý upload ảnh
        if (req.file) {
          let filePath = path.join(avatarDir, req.file.filename);
          console.log("📌 File đã lưu vào:", filePath);
           
          if (!fs.existsSync(filePath)) {
            console.error("❌ Lỗi: File không tồn tại sau khi upload.");
            return res.status(500).send({ success: false, message: "Lỗi lưu file" });
          }
  
          let formData = new FormData();
          formData.append('avatar', fs.createReadStream(filePath));
  
          let uploadResponse = await axios.post(URLCDN_post, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          // Xóa file sau khi upload lên CDN
          fs.unlinkSync(filePath);
  
          let imageUrl = uploadResponse.data.url; 
          // Cập nhật ảnh mới
          product.imgURL = imageUrl;
        }
        product.isDeleted = false;
  
        await product.save();
  
        res.status(200).send({
          success: true,
          data: product
        });
  
      } catch (error) {
        console.error("🔥 Lỗi khi cập nhật sản phẩm:", error);
        res.status(500).send({
          success: false,
          message: error.message
        });
      }
      
    }
  );

  router.delete('/:id', 
    check_authentication,
    check_authorization(constants.MOD_PERMISSION),
    async function(req, res, next) {
      try{
        let body = req.body;
        let product = await productSchema.findById(req.params.id);
        if (!product) {
          return res.status(404).send({
            success: false,
            message: "Sản phẩm không tồn tại"
          });
        }
        product.isDeleted = true;
        await product.save();
        res.status(200).send({
          success: true,
          message: "Sản phẩm đã được đánh dấu là đã xóa"
        });
      } catch (error) {
        console.error("🔥 Lỗi khi xóa sản phẩm:", error);
        res.status(500).send({
          success: false,
          message: "Lỗi server khi xóa sản phẩm",
          error: error.message
        });
      }
  })
  


module.exports = router;
