import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    document.title ="Manage Companies"
    fetchCompanies();
    // eslint-disable-next-line
  }, []);

  const fetchCompanies = async () => {
    const res = await fetch('http://localhost:5000/api/companies', {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setCompanies(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName) return;

    if (editingId) {
      // Update Perusahaan
      await fetch(`http://localhost:5000/api/companies/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ companyName })
      });
    } else {
      // Tambah Perusahaan Baru
      await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ companyName })
      });
    }

    fetchCompanies();
    resetForm();
  };

  const handleEdit = (company) => {
    setEditingId(company.id);
    setCompanyName(company.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus perusahaan ini?')) return;

    await fetch(`http://localhost:5000/api/companies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCompanies();
  };

  const resetForm = () => {
    setEditingId(null);
    setCompanyName('');
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white overflow-x-hidden p-6 text-gray-800">
          <Header />
     <div className='bg-white p-6 rounded-2xl shadow-lg w-full'>
      <h1 className="text-2xl font-bold mb-4">Kelola Perusahaan</h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded space-y-4 shadow-md">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit Perusahaan' : 'Tambah Perusahaan'}</h2>

        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Nama Perusahaan"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            {editingId ? 'Update' : 'Tambah'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-600 text-white px-6 py-2 rounded">
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Tabel List Perusahaan */}
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nama Perusahaan</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="border px-4 py-2 text-center">{company.id}</td>
              <td className="border px-4 py-2 text-center">{company.name}</td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </div>
  );
}
