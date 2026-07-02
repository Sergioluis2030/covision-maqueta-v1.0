import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Car, Users, Camera, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user.role === 1;

  const menuItems = [
    { 
      title: 'Vehículos', 
      icon: Car, 
      path: '/vehicles', 
      color: 'bg-blue-500' 
    },
    ...(isAdmin ? [
      { 
        title: 'Usuarios', 
        icon: Users, 
        path: '/users', 
        color: 'bg-purple-500' 
      },
      { 
        title: 'Puntos de Cámara', 
        icon: Camera, 
        path: '/cameras', 
        color: 'bg-emerald-500' 
      },
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Coovision</h1>
              <p className="text-sm text-gray-500">Sistema de Vigilancia</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role === 1 ? 'Administrador' : 'Cliente'}</p>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Bienvenido, {user.name}</h2>
        <p className="text-gray-600 mb-10">Panel de control - {user.role === 1 ? 'Administrador' : 'Cliente'}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <div 
              key={index}
              onClick={() => navigate(item.path)}
              className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                <item.icon className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-500 mt-2">Gestionar {item.title.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}