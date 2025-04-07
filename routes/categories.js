const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/categories')
let categoriesController = require('../controllers/categories')
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

router.get('/', async function(req, res, next) {
  let queries = req.query;
  let categories = await categorySchema.find({});
  res.send(categories);
});
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});

router.post('/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let result = await categoriesController.createCategories(
        body.categoryName,
        body.description,
      )
      res.status(200).send({
        success: true,
        data: result
      })
    } catch (error) {
      console.error('Lỗi server:', error); // Log chi tiết lỗi
      next(error);
    }

  });
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let category = await categorySchema.findByIdAndUpdate(req.params.id,
      body,{new:true});
    res.status(200).send({
      success:true,
      data:category
    });
  } catch (error) {
    res.status(404).send({
      success:fail,
      message:error.message
    })
  }
});


module.exports = router;
