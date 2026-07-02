import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car, Clock, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';

const fakeVehicles = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  plate: [
    'ABC-1234', 'XYZ-9876', 'DEF-5555', 'GHI-7777', 'JKL-4321',
    'MNO-9999', 'PQR-2468', 'STU-1357', 'VWX-8642', 'YZA-1122',
    'BCD-3344', 'EFG-5566', 'HIJ-7788', 'KLM-9900', 'NOP-2233',
    'QRS-4455', 'TUV-6677', 'WXY-8899', 'ZAB-0011', 'CDE-2233'
  ][i % 20],
  time: `${(14 + Math.floor(i / 3)).toString().padStart(2, '0')}:${(10 + i % 50).toString().padStart(2, '0')}`,
  date: '2025-07-02',
  location: [
    'Cámara 1 - Entrada Norte',
    'Cámara 2 - Centro',
    'Cámara 3 - Salida Sur'
  ][i % 3],
  photoIndex: i % 3   // Para reutilizar solo 3 fotos
}));

const photos = [
  'https://picsum.photos/id/1015/800/600',  // Paisaje 1
  'https://picsum.photos/id/1074/800/600',  // Animal
  'https://picsum.photos/id/1018/800/600'   // Paisaje 2
];

export default function Vehicles() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return fakeVehicles.filter(v =>
      v.plate.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Vehículos Detectados</h1>
          <p className="text-gray-600">Registro en tiempo real de las 3 cámaras</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por placa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-8 py-5 text-left font-semibold text-gray-600">PLACA</th>
                  <th className="px-8 py-5 text-left font-semibold text-gray-600">HORA</th>
                  <th className="px-8 py-5 text-left font-semibold text-gray-600">FECHA</th>
                  <th className="px-8 py-5 text-left font-semibold text-gray-600">UBICACIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentItems.map(vehicle => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                    <td className="px-8 py-6">
                      <div 
                        onClick={() => openModal(vehicle)}
                        className="flex items-center gap-3 cursor-pointer hover:text-blue-600 group"
                      >
                        <Car className="w-6 h-6 text-blue-600 group-hover:scale-110 transition" />
                        <span className="font-mono text-xl font-bold tracking-wider text-gray-800">
                          {vehicle.plate}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-5 h-5" />
                        {vehicle.time}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-700">{vehicle.date}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5" />
                        {vehicle.location}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-8 py-5 border-t">
              <p className="text-sm text-gray-500">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} registros
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 hover:bg-gray-100 rounded-xl disabled:opacity-50 transition disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="px-4 py-2 text-sm font-medium">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 hover:bg-gray-100 rounded-xl disabled:opacity-50 transition disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Popup */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-5 border-b">
              <div>
                <h2 className="text-2xl font-bold">Vehículo: {selectedVehicle.plate}</h2>
                <p className="text-gray-500">{selectedVehicle.location}</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image */}
            <div className="p-8">
              <img 
                src={photos[selectedVehicle.photoIndex]} 
                alt={`Vehículo ${selectedVehicle.plate}`}
                className="w-full rounded-2xl shadow-md"
              />
            </div>

            {/* Info */}
            <div className="px-8 pb-8 grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-semibold text-xl">{selectedVehicle.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-semibold text-xl">{selectedVehicle.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-semibold">{selectedVehicle.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}