const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let orderSchema = require('../models/Order');
let cartItemSchema   = require('../models/cartItem');
let orderDetailSchema = require('../models/OrderDetail');
let productSchema = require('../models/products');
let { check_authentication,
    check_authorization } = require('../Utils/check_auth')

router.get('/my-orders', check_authentication, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderSchema.find({ UserId: userId });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào' });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

router.post('/my-orders', check_authentication, async (req, res, next) => {
    try {
        const userId = req.user.id; 
        console.log(userId);
        const {ShippingAddress, Note, Trangthai, Sdt } = req.body;

        if (!ShippingAddress || !Trangthai || !Sdt) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đơn hàng!' });
        }
        const cartItems = await cartItemSchema.find({ UserId: userId });
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống, không thể tạo đơn hàng!' });
        }

        for (const item of cartItems) {
            const product = await productSchema.findById(item.ProductId);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm ${item.ProductId} không tồn tại!` });
            }
            if (item.Quantity > product.quantity) {
                return res.status(400).json({ message: `Sản phẩm ${product.productName} chỉ còn ${product.quantity} sản phẩm trong kho!` });
            }
        }
        const totalPrice = cartItems.reduce((total, item) => total + item.Price * item.Quantity, 0);

        const newOrder = new orderSchema({
            UserId: userId, 
            OrderDate: new Date(),
            TotalPrice:totalPrice ,
            ShippingAddress,
            Note: Note || "",
            Trangthai,
            Sdt
        });

        const savedOrder = await newOrder.save();
        if (!savedOrder || !savedOrder._id) {
            return res.status(500).json({ message: 'Không thể tạo đơn hàng!' });
        }
        

         // Lưu sản phẩm vào OrderDetail
         const orderDetails = cartItems.map(item => ({
            OrderId: savedOrder._id,
            ProductId: item.ProductId,
            Quantity: item.Quantity,
            Price: item.Price
        }));

        await orderDetailSchema.insertMany(orderDetails);
        for (const item of cartItems) {
            await productSchema.findByIdAndUpdate(item.ProductId, {
                $inc: { quantity: -item.Quantity }
            });
        }
        await cartItemSchema.deleteMany({ UserId: userId });

        res.status(201).json({ message: 'Đơn hàng đã được tạo!', order: savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
});



    


module.exports = router;