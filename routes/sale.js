const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let saleSchema = require('../models/Sale');

router.get('/:id', async function(req, res, next) {
  try {
    let sale = await saleSchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:sale
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});

router.post('/saleadd', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newSale = new saleSchema({
    saleName: body.saleName,
    discount: body.discount,
    startDate: body.startDate,
    endDate: body.endDate
  });
  await newSale.save();
  res.send(newSale);
});

router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let sale = await saleSchema.findByIdAndUpdate(req.params.id,
      body, { new: true }
    );
    res.status(200).send({
      success: true,
      data: sale
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
      let sale = await saleSchema.findById(req.params.id);
      
      if (!sale) {
        return res.status(404).send({
          success: false,
          message: "Sale không tồn tại!"
        });
      }
  
      // Cập nhật isActive thành false
      sale.isActive = false;
      await sale.save();
  
      res.status(200).send({
        success: true,
        message: "Sale đã bị vô hiệu hóa!",
        data: sale
      });
  
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message
      });
    }
  });
  


module.exports = router;