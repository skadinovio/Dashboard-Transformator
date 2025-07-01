import React from 'react';

export default function TransformatorInfo({ transformatorInfo, setTransformatorInfo }) {
  const handleChange = (index, field, value) => {
    setTransformatorInfo(transformatorInfo.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-700">Informasi Transformator</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2">MVA Rating</th>
              <th className="border px-3 py-2">Rate Voltage</th>
              <th className="border px-3 py-2">Frequency</th>
              <th className="border px-3 py-2">Connection</th>
              <th className="border px-3 py-2">Phases</th>              
              <th className="border px-3 py-2">Equipment Voltage</th>
            </tr>
          </thead>
          <tbody>
            {transformatorInfo.map((row, idx) => (
              <tr key={idx}>
                {['mva_rating','rate_voltage','frequency','connection','phases','equipment_voltage'].map(field => (
                  <td className="border px-2 py-1" key={field}>
                    <input
                      type="text"
                      value={row[field]}
                      onChange={e => handleChange(idx, field, e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                ))}                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
