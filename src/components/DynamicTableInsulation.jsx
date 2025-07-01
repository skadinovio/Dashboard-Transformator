import { useState } from 'react';

export default function DynamicTableInsulation({ onChange }) {
  const [rows, setRows] = useState([
    { test_point: '', voltage: '', result: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    onChange(updated);
  };

  const addRow = () => {
    setRows([...rows, { test_point: '', voltage: '', result: '' }]);
  };

  const removeLastRow = () => {
    if (rows.length > 1) {
      const updated = rows.slice(0, -1);
      setRows(updated);
      onChange(updated); // kirim perubahan ke parent
    }
  };
  
  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-lg text-blue-700">Insulation Resistance</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">No</th>
            <th className="border px-2 py-1">Test Point</th>
            <th className="border px-2 py-1">Voltage Test</th>
            <th className="border px-2 py-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.test_point}
                  onChange={e => handleChange(index, 'test_point', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                />
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.voltage}
                  onChange={e => handleChange(index, 'voltage', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                /> V DC
              </td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  value={row.result}
                  onChange={e => handleChange(index, 'result', e.target.value)}
                  className="w-full border rounded px-1 py-0.5"
                /> MΩ
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex space-x-2 mt-2">
      <button type='button' onClick={addRow} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
        + Tambah Baris
      </button>
      <button
          type="button"
          onClick={removeLastRow}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          − Hapus Baris
        </button>
        </div>
    </div>
  );
}
