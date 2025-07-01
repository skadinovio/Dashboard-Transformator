import { useState } from 'react';

export default function DynamicTableTTR({ onChange }) {
  const [rows, setRows] = useState([
    {
      primer: '',
      sec: '',
      theory: '',
      n_a: '',
      error_a: '',
      n_b: '',
      error_b: '',
      n_c: '',
      error_c: '',
    }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
    onChange(updated); // kirim ke parent
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        primer: '',
        sec: '',
        theory: '',
        n_a: '',
        error_a: '',
        n_b: '',
        error_b: '',
        n_c: '',
        error_c: '',
      }
    ]);
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
      <h2 className="font-semibold text-lg text-blue-700">Tabel TTR (Turns Transformer Ratio)</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
              <th class="border px-4 py-2" rowspan="2">TAP</th>
              <th class="border px-4 py-2" colspan="2">Voltage</th>
              <th class="border px-4 py-2" rowspan="2">Theory</th>
              <th class="border px-4 py-2" colspan="1">A-B</th>
              <th class="border px-4 py-2" rowspan="2">Error</th>
              <th class="border px-4 py-2" colspan="1">B-C</th>
              <th class="border px-4 py-2" rowspan="2">Error</th>
              <th class="border px-4 py-2" colspan="1">C-A</th>
              <th class="border px-4 py-2" rowspan="2">Error</th>
          </tr>
          <tr>
              <th class="border px-4 py-2">Primer</th>
              <th class="border px-4 py-2">Sec</th>
              <th class="border px-4 py-2">n-a</th>
              <th class="border px-4 py-2">n-b</th>
              <th class="border px-4 py-2">n-c</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              {Object.keys(row).map((key) => (
                <td key={key} className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full border rounded px-1 py-0.5"
                    value={row[key]}
                    onChange={(e) => handleChange(index, key, e.target.value)}
                  />
                </td>
              ))}
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
