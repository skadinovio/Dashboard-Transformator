import { useState } from 'react';
import LaporanSection from './LaporanSection';
// eslint-disable-next-line
import ReportChart from './ReportChart';

export default function ReportTabs({ report }) {
  const [tab, setTab] = useState('tabel');

  const transformatorInfo = report?.transformator_info || [];
  const ttrData = report?.data?.ttr || [];
  const windinghv = report?.data?.winding_hv || [];
  const windinglv = report?.data?.winding_lv || [];
  const insulationdata = report?.data?.insulation || [];
  const bdvBefore = report?.data?.bdv_before || [];
  const bdvAfter = report?.data?.bdv_after || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('tabel')}
          className={`px-4 py-2 rounded ${tab === 'tabel' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Tabel
        </button>
        <button
          onClick={() => setTab('grafik')}
          className={`px-4 py-2 rounded ${tab === 'grafik' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Grafik
        </button>
      </div>

      {/* Konten tab */}
      {tab === 'tabel' && (
        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">          
          {/* Transformator Info */}
          {transformatorInfo.length > 0 && (
            <div className='overflow-x-auto'>
              <h3 className="text-lg font-semibold">Informasi Transformator</h3>
              <table className="min-w-full border text-sm ">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">MVA Rating</th>
                    <th className="border px-2 py-1">Rate Voltage</th>
                    <th className="border px-2 py-1">Frequency</th>
                    <th className="border px-2 py-1">Connection</th>
                    <th className="border px-2 py-1">Phases</th>
                  </tr>
                </thead>
                <tbody>
                  {transformatorInfo.map((info, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1" >{info.mva_rating}</td>
                      <td className="border px-2 py-1">{info.rate_voltage} kV</td>
                      <td className="border px-2 py-1">{info.frequency} Hz</td>
                      <td className="border px-2 py-1">{info.connection}</td>
                      <td className="border px-2 py-1">{info.phases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <LaporanSection title="TTR" data={ttrData} />
          <LaporanSection title="Winding Resistance HV" data={windinghv} />
          <LaporanSection title="Winding Resistance LV" data={windinglv} />
          <LaporanSection title="Insulation Resistance" data={insulationdata} />
          <LaporanSection title="BDV Before" data={bdvBefore} />
          <LaporanSection title="BDV After" data={bdvAfter} />
        </div>
      )}

      {tab === 'grafik' && (
        <div className="space-y-4">
          <ReportChart report={report} />
        </div>
      )}
    </div>
  );
}
