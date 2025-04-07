const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let cartItemSchema   = require('../models/cartItem');
let productSchema = require('../models/products');
let { check_authentication,
    check_authorization } = require('../Utils/check_auth')

router.get('/cartitems', check_authentication, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartitem = await cartItemSchema.find({ UserId: userId });
        if (!cartitem || cartitem.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sp nào' });
        }
        res.status(200).json(cartitem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

router.post('/cartitems', check_authentication, async (req, res) => {
    try {
        const userId = req.user.id;
        const { ProductId, Quantity} = req.body;
        if (!ProductId || Quantity === undefined || Quantity < 1) {
            return res.status(400).json({ message: 'Sản phẩm hoặc số lượng không hợp lệ!' });
        }

        let product = await productSchema.findById(ProductId);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let cartItem = await cartItemSchema.findOne({ UserId: userId, ProductId });

        if (cartItem) {
            // Kiểm tra nếu tổng số lượng sau khi thêm không vượt quá số lượng tồn kho
            if (cartItem.Quantity + Quantity <= product.quantity) {
                cartItem.Quantity += Quantity;
                await cartItem.save();
                return res.status(200).json({ message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công!', cartItem });
            } else {
                return res.status(400).json({ message: 'Số lượng sản phẩm vượt quá hàng tồn kho!' });
            }
        } else {
            // Kiểm tra nếu số lượng thêm vào vượt quá số lượng tồn kho
            if (Quantity <= product.quantity) {
                cartItem = new cartItemSchema({ UserId: userId, ProductId, Quantity, Price: product.price });
                await cartItem.save();
                return res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!', cartItem });
            } else {
                return res.status(400).json({ message: 'Số lượng sản phẩm vượt quá hàng tồn kho!' });
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error });
    }
});

router.post('/update', check_authentication,async function (req, res,next) {
    try{
         let userId = req.user.id;
         const {ProductId,newQuantity } = req.body;
         let product = await productSchema.findById(ProductId);
         if (!product) {
             return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
         }
         let cartItem = await cartItemSchema.findOne({ ProductId: ProductId, UserId: userId });
         if (!cartItem) {
             return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
         }
         if (newQuantity <= 0) {
            return res.status(400).json({ message: 'Số lượng sản phẩm phải lớn hơn 0' });
        }
        if(newQuantity>=product.quantity) {
            return res.status(400).json({ message: 'Số lượng sản phẩm lớn hơn trong kho' });
        }
       
         cartItem.Quantity = newQuantity;
         await cartItem.save();
         return res.status(200).json({ message: 'Cập nhật thành công', cartItem });
    } catch (error) {
     console.error(error);
     return res.status(500).json({ message: 'Lỗi server', error });
     }
 });

router.delete('/delete',check_authentication, async function(req, res,next){
    try{
        let userId = req.user.id;
        const {ProductId} = req.body;
        let product = await productSchema.findById(ProductId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
         let cartItem = await cartItemSchema.findOne({ ProductId: ProductId, UserId: userId });
        if (!cartItem) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }
        await cartItem.deleteOne();
        return res.status(200).json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công!' });
    }catch (error) {
        console.error('Lỗi:', error);
        return res.status(500).json({ message: 'Lỗi server!', error });
    }
})

module.exports = router;