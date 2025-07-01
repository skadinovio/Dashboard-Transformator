import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: '', company_id: '' });
  const token = localStorage.getItem('token');
  const [companies, setCompanies] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchCompanies = async () => {
    const res = await fetch('http://localhost:5000/api/companies', {
      headers: { Authorization: token }
    });
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => {
    document.title ="Manage Users"
    fetchUsers();
    // eslint-disable-next-line
    fetchCompanies();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus user ini?')) return;

    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      // Edit mode
      await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
    } else {
      // Add mode
      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
    }

    setShowForm(false);
    setEditingUser(null);
    setFormData({ username: '', password: '', role: '', company_name: '' });
    fetchUsers();
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      company_name: user.company_name || ''
    });
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({ username: '', password: '', role: '', company_name: '' });
    setShowForm(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white overflow-x-hidden p-6 text-gray-800">
          <Header />
     <div className='bg-white p-6 rounded-2xl shadow-lg w-full'>
      <h1 className="text-2xl font-bold mb-4">Kelola User</h1>

      <button
        onClick={openAddForm}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Tambah User
      </button>

      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Company ID</th>
            <th className="border px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2 text-center">{user.id}</td>
              <td className="border px-4 py-2 text-center">{user.username}</td>
              <td className="border px-4 py-2 text-center">{user.role}</td>
              <td className="border px-4 py-2 text-center">
                {user.company_name || '-'}
              </td>
              <td className="border px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => openEditForm(user)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Tambah/Edit */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 bg-gray-50 p-6 rounded space-y-4 shadow">
          <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Tambah User'}</h2>

          <div>
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Password {editingUser && '(opsional)'}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder={editingUser ? 'Biarkan kosong jika tidak mau ubah password' : ''}
              {...(!editingUser && { required: true })}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Role --</option>
              <option value="admin">Admin</option>
              <option value="teknisi">Teknisi</option>
              <option value="perusahaan">Perusahaan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Nama Perusahaan (hanya untuk role perusahaan)</label>
            <select
              value={formData.company_id}
              onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              disabled={formData.role !== 'perusahaan'} // hanya aktif kalau role perusahaan
              required={formData.role === 'perusahaan'} // wajib diisi kalau role perusahaan
            >
              <option value="">-- Pilih Perusahaan --</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {editingUser ? 'Update' : 'Simpan'}
          </button>
        </form>
      )}
    </div>
    </div>
  );
}
