const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let menuSchema = require('../models/menu');

router.get('/all', async function(req, res, next) {
  try {
    // Lấy tất cả menu từ database
    let menus = await menuSchema.find({}).lean();

    // Đổi text của menu cha (nếu có parent) thành text của menu cha
    menus = menus.map(menu => {
      if (menu.parent) {
        // Tìm menu cha theo parent _id
        const parentMenu = menus.find(m => String(m._id) === String(menu.parent));
        if (parentMenu) {
          menu.parent = parentMenu.text; // Thay parent bằng text của menu cha
        }
      } else {
        menu.parent = 'Không'; // Nếu không có parent, hiển thị 'Cha'
      }
      return menu;
    });

    // Trả về tất cả menu dưới dạng JSON
    res.json({ success: true, data: menus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get('/', async function(req, res, next) {
  try {
    // Lấy tất cả menu từ database
    let menus = await menuSchema.find({}).lean();

    // Hàm để xây dựng cây menu
    function buildTree(items, parentId = null) {
      return items
        .filter(item => String(item.parent) === String(parentId))
        .map(item => ({
          ...item,
          children: buildTree(items, item._id) // Lấy con của item này
        }));
    }

    // Gọi hàm buildTree với parent = null (các menu cấp 1)
    let menuTree = buildTree(menus);

    // Đổi text của menu cha (nếu có parent) thành text của menu cha
    menuTree = menuTree.map(menu => {
      // Kiểm tra nếu menu có parent là _id nào
      if (menu.parent) {
        // Tìm menu cha theo parent _id
        const parentMenu = menus.find(m => String(m._id) === String(menu.parent));
        if (parentMenu) {
          menu.parent = parentMenu.text; // Thay parent bằng text của menu cha
        }
      } else {
        menu.parent = 'Cha'; // Nếu không có parent, hiển thị 'Cha'
      }
      return menu;
    });

    res.json({ success: true, data: menuTree });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newmenu = new menuSchema({
    text: body.text,
    url: body.url,
    parent: body.parent
  });
  await newmenu.save();
  res.send(newmenu);
});
// Lấy thông tin menu theo ID
router.get('/:id', async function(req, res, next) {
  try {
    const menu = await menuSchema.findById(req.params.id); // Lấy menu theo ID
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu không tồn tại!"
      });
    }
    res.status(200).json({
      success: true,
      data: menu
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let menu = await menuSchema.findByIdAndUpdate(req.params.id,
      body, { new: true }
    );
    res.status(200).send({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    });
  }
});

router.delete('/:id', async function(req, res, next) {
    try {
      let menu = await menuSchema.findById(req.params.id);
      
      if (!menu) {
        return res.status(404).send({
          success: false,
          message: "Menu không tồn tại!"
        });
      }
  
      menu.isDeleted = true;
      await menu.save();
  
      res.status(200).send({
        success: true,
        message: "Menu đã bị vô hiệu hóa!",
        data: menu
      });
  
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message
      });
    }
  });
  

module.exports = router;