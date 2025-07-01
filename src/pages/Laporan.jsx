import { useState, useEffect } from 'react';
import Header from '../components/Header';
import TransformatorInfo from '../components/TransformatorInfo';
import DynamicTableTTR from '../components/DynamicTableTTR';
import DynamicWindingTable from '../components/DynamicWindingTable';
import DynamicTableInsulation from '../components/DynamicTableInsulation';
import DynamicTableBDV from '../components/DynamicTableBDV';

export default function Laporan() {
  const token = localStorage.getItem('token');
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ttrData, setTtrData] = useState([]);
  const [hvData, setHvData] = useState([]);
  const [lvData, setLvData] = useState([]);
  const [insulationData, setInsulationData] = useState([]);
  const [bdvBefore, setBdvBefore] = useState([]);
  const [bdvAfter, setBdvAfter] = useState([]);
  const [transformatorInfo, setTransformatorInfo] = useState([
    { mva_rating:'', rate_voltage:'', frequency:'', connection:'', phases:'' }
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/companies')
      .then(res => res.json())
      .then(data => {
        console.log('API Response:', data);
        // jika data = { companies: [...] }, gunakan data.companies
        const list = Array.isArray(data) ? data : data.companies;
        setCompanyList(list || []);
      })
      .catch(err => console.error(err));
  }, []);
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      const payload = {
      company_id: selectedCompanyId,
      year: selectedYear,
      transformator_info: transformatorInfo,
      data: {
        ttr: ttrData,
        winding_hv: hvData,
        winding_lv: lvData,
        insulation: insulationData,
        bdv_before: bdvBefore,
        bdv_after: bdvAfter
      }
    };
    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , Authorization: `Bearer ${token}`,},
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('✅ Laporan berhasil disimpan!');
      } else {
        const err = await res.json();
        alert('❌ Gagal menyimpan: ' + (err.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error koneksi ke server.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white overflow-x-hidden p-6 text-gray-800">
      <Header />
      <div className='bg-white p-6 rounded-2xl shadow-lg w-full'>
      <form onSubmit={handleSubmit} className="space-y-8">
    
      {/* 🔹 Pilihan Perusahaan */}      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center">
        <label className="block font-semibold mb-1 px-3">Pilih Perusahaan:</label>
        <select
          value={selectedCompanyId}
          onChange={e => setSelectedCompanyId(e.target.value)}
          className='md:w-1/5 px-4 py-2 mx-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value="">-- Pilih Perusahaan --</option>
          {companyList.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      
      {/* 🔹 Input Tahun */}
        <label className="block font-semibold mb-1 p-3">Tahun Laporan:</label>
        <input
          type="number"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="md:w-1/5 px-4 py-2 mx-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* 🔹 Input Tanggal 
      <div>
        <label className="block font-semibold mb-1">Tanggal Input:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>*/} 

        <TransformatorInfo
          transformatorInfo={transformatorInfo}
          setTransformatorInfo={setTransformatorInfo}
        />
        <DynamicTableTTR onChange={setTtrData} />
        <DynamicWindingTable title="Winding Resistance - HV Side" onChange={setHvData} />
        <DynamicWindingTable title="Winding Resistance - LV Side" onChange={setLvData} />
        <DynamicTableInsulation onChange={setInsulationData} />
        <DynamicTableBDV onChangeBefore={setBdvBefore} onChangeAfter={setBdvAfter} />
        <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          Simpan Laporan
        </button>
      </form>
    </div>
    </div>
  );
}