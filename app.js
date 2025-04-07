var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var ejsLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var authRouter = require('./routes/auth');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var orderRouter = require('./routes/order');
var orderDetailRouter = require('./routes/orderdetail');
var cartItemRouter = require('./routes/cartItem');
var saleRouter = require('./routes/sale');
var menuRouter = require('./routes/menu');

var app = express();
app.use(express.json());

// Cấu hình CORS chỉ với origin và credentials
app.use(cors({
  origin: ['http://localhost:3001','http://localhost:5000'], // Cho phép React app gọi
  credentials: true                // Cho phép gửi cookies, FormData, v.v
}));

// Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/BaoCao")
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout'); 

// Cấu hình các thư mục tĩnh
app.use(express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts);

// app.js
app.set('layout', 'layouts/layout'); // Chỉ định layout mặc định

app.get('/', (req, res) => {
  res.render('pages/index', { 
    title: 'Trang chủ',
  });
});

// Định nghĩa các route khác
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/order', orderRouter);
app.use('/orderdetail', orderDetailRouter);
app.use('/cartitem', cartItemRouter);
app.use('/sale', saleRouter);
app.use('/menu', menuRouter);

// Xử lý lỗi 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi server
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message
  });
});

module.exports = app;
