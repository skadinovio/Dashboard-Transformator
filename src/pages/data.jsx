import { useEffect, useState, useRef } from 'react';
import ReportTabs from '../components/ReportTabs';
import ExportPDF from '../components/ExportPDF';
import Header from '../components/Header';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdminOrTeknisi = user?.role === 'admin' || user?.role === 'teknisi';

  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(user?.company_id || '');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const reportRef = useRef();

  // Ambil daftar perusahaan kalau admin/teknisi
  useEffect(() => {
    document.title = "Data";

    if (isAdminOrTeknisi) {
      // eslint-disable-next-line
      fetchCompanies();
    } else if (user?.company_id) {
      setSelectedCompanyId(user.company_id);
    }
    // eslint-disable-next-line
  }, []);
  // Fetch report berdasarkan perusahaan dan tahun
  useEffect(() => {
    if (selectedCompanyId && selectedYear) {
      fetchReport(selectedCompanyId, selectedYear);
    }// eslint-disable-next-line
  }, [selectedCompanyId, selectedYear]);

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

  const fetchReport = async (companyId, year) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${companyId}/${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Data tidak ditemukan');

      const data = await res.json();
      setReportData(data);
      setError(null);
    } catch (err) {
      setReportData(null);
      setError(err.message);
    }
  };

  const handleCompanyChange = (e) => {
    setSelectedCompanyId(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div class= "bg-gradient-to-br from-gray-100 to-white overflow-x-hidden p-6 text-gray-800">
      <Header />
      <div className='bg-white p-6 rounded-2xl shadow-lg w-full'>
        {/* Filter */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center">
          {isAdminOrTeknisi && (
            <select
              value={selectedCompanyId}
              onChange={handleCompanyChange}
              className="md:w-1/5 px-4 py-2 mx-3 mb-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Perusahaan</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full md:w-1/5 px-4 py-2 mx-3 mb-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tahun"
          />

          {reportData && (
          <div className="space-y-6 mx-3 mb-3">
            {/* Export PDF */}
            <ExportPDF report={reportData} />
          </div>
        )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {/* Report Content */}
        {reportData && (
          <div className="space-y-6">
            {/* Report Tabs */}
            <div ref={reportRef} className='overflow-x-auto'>
              <ReportTabs report={reportData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
