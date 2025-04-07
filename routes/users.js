var express = require('express');
var router = express.Router();
let userSchema = require('../models/users');
let userController = require('../controllers/users')
let BuildQueries = require('../Utils/BuildQuery');
let { check_authentication,
  check_authorization } = require('../Utils/check_auth')
let constants = require('../Utils/constants')
let { validators, validator_middleware } = require('../Utils/validator')
let multer = require('multer')
let path = require('path')
let URLCDN_post = "http://localhost:4000/upload";
let axios = require('axios');
let FormData = require('form-data');
let fs = require('fs');
const { header } = require('express-validator');


router.get('/', async function (req, res, next) {
  try {
    const queries = req.query;
    const filter = BuildQueries.QueryUser(queries); 

    const users = await userSchema.find(filter).populate('role');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy danh sách người dùng'
    });
  }
});

router.get('/:id'
  , check_authentication
  , async function (req, res, next) {
  try {
    if (req.user._id == req.params.id) {
      let user = await userSchema.findById(req.params.id).populate('role');
      res.status(200).send({
        success: true,
        data: user
      });
    } else {
      throw new Error("ban khong co quyen")
    }
  } catch (error) {
    next(error)
  }
});

router.get('/users/:id', async function(req, res, next) {
  try {
    let user = await userSchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    });
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
      //console.log("hehehe");
      cb(null, true);
    }, limits: {
      fileSize: 5 * 1024 * 1024
    }
  });
router.post('/',
  // check_authentication,
  // check_authorization(constants.MOD_PERMISSION),
  upload.single('avatar'),
  validators, validator_middleware,
  async function (req, res, next) {
    try {
      let body = req.body;
      if (!req.file) {
        res.status(404).send({
          success: false,
          message: "file khong ton tai"
        })
      }else{
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
        let result = await userController.createUser(
          body.username,
          body.password,
          body.email,
          body.fullName,
          imageUrl,
          body.role
        )
        res.status(200).send({
          success: true,
          data: result
        })
      }
    } catch (error) {
      next(error);
    }

  });

  router.put(
    "/:id",
    // check_authentication,
    // check_authorization(constants.MOD_PERMISSION),
    upload.single("avatar"),
    async function (req, res, next) {
      try {
        let body = req.body;
        let user = await userSchema.findById(req.params.id).populate({
          path: "role",
          select: "roleName",
        });
  
        if (!user) {
          return res.status(404).send({
            success: false,
            message: "User không tồn tại",
          });
        }
  
        let allowField = ["password", "email", "fullName"];
        for (const key of Object.keys(body)) {
          if (allowField.includes(key)) {
            user[key] = body[key];
          }
        }
  
        // Xử lý upload avatar nếu có file mới
        if (req.file) {
          let filePath = path.join(avatarDir, req.file.filename);
          console.log("📌 File đã lưu vào:", filePath);
  
          if (!fs.existsSync(filePath)) {
            console.error("❌ Lỗi: File không tồn tại sau khi upload.");
            return res.status(500).send({ success: false, message: "Lỗi lưu file" });
          }
  
          let formData = new FormData();
          formData.append("avatar", fs.createReadStream(filePath));
  
          let uploadResponse = await axios.post(URLCDN_post, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
          // Xóa file sau khi upload lên CDN thành công
          fs.unlinkSync(filePath);
  
          // URL ảnh mới từ server CDN
          let newImageUrl = uploadResponse.data.url;
          // Cập nhật avatar mới
          user.avatarUrl = newImageUrl;
        }
  
        await user.save();
        res.status(200).send({
          success: true,
          data: user,
        });
      } catch (error) {
        next(error);
      }
    }
  );
  
  
  router.post('/change_avatar', check_authentication, upload.single('avatar'), async function (req, res, next) {
    if (!req.file) {
      res.status(404).send({
        success: false,
        message: "file khong ton tai"
      })
    } else {
      let formData = new FormData();
      let filePath = path.join(avatarDir, req.file.filename)
      console.log("📌 File đã lưu vào:", filePath);
      if (!fs.existsSync(filePath)) {
        console.error("❌ Lỗi: File không tồn tại sau khi upload.");
        return res.status(500).send({ success: false, message: "Lỗi lưu file" });
    }

      formData.append('avatar', fs.createReadStream(filePath));
      let result = await axios.post(
        URLCDN_post, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(result.data.url);
      fs.unlinkSync(filePath)
      let url = result.data.url;
      req.user.avatarUrl= url;
      await req.user.save()
      res.status(200).send({
        success:true,
        message:req.user
      })
    }
  })
  router.get("/avatars/:filename", function (req, res, next) {
    let filename = req.params.filename;
    let fileDir = path.join(avatarDir, filename);
    res.sendFile(fileDir);
  });

module.exports = router;