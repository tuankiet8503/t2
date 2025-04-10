import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Chỉ import Routes và Route
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartItem from './components/CartItem';
import LoginForm from './components/loginForm'; 
import RegisterForm from './components/registerForm';
function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 p-4 text-white">
        <h1 className="text-3xl font-bold">Cửa hàng của tôi</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <Routes> {/* Không bọc thêm Router ở đây */}
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartItem />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center">
        © 2023 My Shop
      </footer>
    </div>
  );
}

export default App;