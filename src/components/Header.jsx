import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
const token = localStorage.getItem('token');

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(user?.company_id || '');

   useEffect(() => {
      if (user?.role === 'admin' || user?.role === 'teknisi' || user?.role === 'perusahaan') {
        // eslint-disable-next-line
        fetchCompanies();
      } else if (user?.company_id) {
        setSelectedCompanyId(user.company_id);
      }
      // eslint-disable-next-line
    }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/companies', {
        headers: { Authorization: token }
      });
      const data = await res.json();
      setCompanies(data);

      // Default pilih perusahaan pertama kalau belum ada
      if (data.length > 0 && !selectedCompanyId) {
        setSelectedCompanyId(data[0].id);
      }
    } catch (err) {
      console.error('Gagal fetch companies', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Menu item by role
  const isAdmin = user?.role === 'admin';
  const isTeknisi = user?.role === 'teknisi';

  const navStyle = ({ isActive }) =>{
    return{
      color: isActive ? 'white' : 'black',
      backgroundColor: isActive ? 'oklch(54.6% 0.245 262.881)' : 'white',
    }
  }

  return (
    <div>
      <div class="w-full h-full space-y-8 pb-8">
          <div class="relative bg-blue-600 text-white rounded-2xl p-6 shadow-lg overflow-hidden w-full">
              <div class="absolute right-0 bottom-0 opacity-30">
                  <svg width="200" height="200" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="50" fill="white" />
                  </svg>
              </div>
              <div class="relative z-10 flex flex-col md:flex-row justify-between items-center">
                  <h1 class="text-3xl font-bold">Sistem Monitoring Transformator</h1>
                  <div class="mt-4 md:mt-0 flex space-x-2">
                      {/* Rode + Nama perusahaan */}
                      <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col md:flex-row items-center gap-2 text-sm font-medium">
                        {user?.role === 'perusahaan' ? (
                          <>
                            <span className="bg-white text-blue-600 px-4 py-1.5 rounded-full">
                              {user?.role.toUpperCase()}
                            </span>
                            {selectedCompanyId && (
                              <span className="bg-white text-blue-600 px-4 py-1.5 rounded-full">
                                {companies.find((c) => c.id === parseInt(selectedCompanyId))?.name || 'Perusahaan Tidak Dikenal'}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="bg-white text-blue-600 px-4 py-1.5 rounded-full">
                            {user?.role.toUpperCase()}
                          </span>
                        )}
                      </div>     
                     </div>
                  </div>
              </div>
          </div>
        {/* Navigasi versi desktop (md ke atas) */}
        <nav className="hidden md:flex flex-row space-x-4 w-full">
          <NavLink to="/dashboard" style={navStyle} className="bg-white-600 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition-all text-sm font-medium">
            Dashboard
          </NavLink>
          <NavLink to="/data" style={navStyle} className="bg-white-600 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition-all text-sm font-medium">
            Data
          </NavLink>
          {(isAdmin || isTeknisi) && (
            <NavLink to="/laporan" style={navStyle} className="bg-white-600 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition-all text-sm font-medium">
              Laporan
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/manage-companies" style={navStyle} className="bg-white-600 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition-all text-sm font-medium">
                Kelola Perusahaan
              </NavLink>
              <NavLink to="/manage-users" style={navStyle} className="bg-white-600 text-black px-6 py-2 rounded-lg shadow hover:bg-blue-500 transition-all text-sm font-medium">
                Kelola User
              </NavLink>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-black px-6 py-2 rounded-lg shadow hover:bg-red-500 transition-all text-sm font-medium"
          >
            Logout
          </button>
        </nav>

        {/* Navigasi versi mobile (max-md) */}
        <div className="md:hidden w-full">
          <select
            className="w-full px-4 py-2 rounded-lg border shadow focus:outline-none"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'logout') {
                handleLogout();
              } else {
                navigate(value);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>Pilih Menu</option>
            <option value="/dashboard">Dashboard</option>
            <option value="/data">Data</option>
            {(isAdmin || isTeknisi) && <option value="/laporan">Laporan</option>}
            {isAdmin && (
              <>
                <option value="/manage-companies">Kelola Perusahaan</option>
                <option value="/manage-users">Kelola User</option>
              </>
            )}
            <option value="logout">Logout</option>
          </select>
        </div>
      </div>
    </div>
  );
}