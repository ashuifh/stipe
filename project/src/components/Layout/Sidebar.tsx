import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  RefreshCw,
  LogOut, 
  Store,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { state, logout } = useApp();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard/sales', icon: ShoppingCart, label: 'Sales', roles: ['admin', 'cashier'] },
    { path: '/dashboard/inventory', icon: Package, label: 'Inventory', roles: ['admin', 'cashier'] },
    { path: '/dashboard/customers', icon: Users, label: 'Customers', roles: ['admin', 'cashier'] },
    { path: '/dashboard/refunds', icon: RefreshCw, label: 'Refunds', roles: ['admin', 'cashier'] },
    { path: '/dashboard/reports', icon: BarChart3, label: 'Reports', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(state.currentUser?.role || '')
  );

  return (
    <div className="bg-white h-full shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RetailPOS</h1>
            <p className="text-sm text-gray-500">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-300 p-2 rounded-full">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{state.currentUser?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{state.currentUser?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;