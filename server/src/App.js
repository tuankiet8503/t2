import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleList from './component/Roles/RoleList';
import AddRoleForm from './component/Roles/AddRoleForm';
import EditRoleForm from './component/Roles/EditRoleForm';
import UserList from './component/Users/UserList';
import AddUserForm from './component/Users/AddUserForm';
import EditUserForm from './component/Users/EditUserForm';
import CategoryList from './component/Categories/CategoryList';
import LoginForm from './component/Users/loginForm'; 
import RegisterForm from './component/Users/registerForm';
import AddCategoryForm from './component/Categories/AddCategoryForm';
import EditCategoryForm from './component/Categories/UpdateCategoryForm'; 
import MenuList from './component/Menu/MenuList';
import AddMenuForm from './component/Menu/AddMenu';
import EditMenuForm from './component/Menu/EditMenu';
import SaleList from './component/Sales/Sale';
import CreateSale from './component/Sales/CreateSale';
import EditSale from './component/Sales/EditSale';
import Sidebar from './component/Menu/slidebar';
import ProductList from './component/Products/ProductList';
import ProductDetail from './component/Products/ProductDetail';
import AddProduct from './component/Products/AddProduct';
import CartItem from './component/CartItems/CartItem';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Role routes */}
          <Route path="/" element={<RoleList />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/add-role" element={<AddRoleForm />} />
          <Route path="/edit-role/:id" element={<EditRoleForm />} />
           {/* User routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/add-user" element={<AddUserForm />} />
          <Route path="/edit-user/:id" element={<EditUserForm />} />
           {/* Category routes */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/add-category" element={<AddCategoryForm />} />
          <Route path="/edit-category/:id" element={<EditCategoryForm />} />
          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Redirect to role list if no match */}
          <Route path="menu" element={<MenuList />} />
          <Route path="/add-menu" element={<AddMenuForm />} />
          <Route path="/edit-menu/:menuId" element={<EditMenuForm />} />
          <Route path="/sidebar" element={<Sidebar />} />
          {/* Menu routes */}
          <Route path="/sale" element={<SaleList />} />
          <Route path="/sale-add" element={<CreateSale />} />
          <Route path="/sale-edit/:id" element={<EditSale />} />
          {/* Product routes */} 
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/add-product" element={<AddProduct />} />

          {/* Cart routes */}
          <Route path="/cart" element={<CartItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
