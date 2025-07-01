import { useState } from 'react';

export default function DynamicTableBDV({ onChangeBefore, onChangeAfter }) {
  const [beforeRows, setBeforeRows] = useState([{ value: '' }]);
  const [afterRows, setAfterRows] = useState([{ value: '' }]);

  const handleChange = (type, index, value) => {
    const target = type === 'before' ? [...beforeRows] : [...afterRows];
    target[index].value = value;

    if (type === 'before') {
      setBeforeRows(target);
      onChangeBefore(target);
    } else {
      setAfterRows(target);
      onChangeAfter(target);
    }
  };

  const addRow = (type) => {
    const newRow = { value: '' };
    if (type === 'before') {
      const updated = [...beforeRows, newRow];
      setBeforeRows(updated);
      onChangeBefore(updated);
    } else {
      const updated = [...afterRows, newRow];
      setAfterRows(updated);
      onChangeAfter(updated);
    }
  };

  const removeRow = (type) => {
    if (type === 'before' && beforeRows.length > 1) {
      const updated = beforeRows.slice(0, -1);
      setBeforeRows(updated);
      onChangeBefore(updated);
    } else if (type === 'after' && afterRows.length > 1) {
      const updated = afterRows.slice(0, -1);
      setAfterRows(updated);
      onChangeAfter(updated);
    }
  };

  const renderTable = (type, rows) => (
    <div>
      <h3 className="font-semibold text-md mt-4 text-blue-600">
        BDV {type === 'before' ? 'Before' : 'After'}
      </h3>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
              <th class="border px-4 py-2" colspan="2">BDV {type === 'before' ? 'Before' : 'After'}</th>
          </tr>
          <tr>              
          <th class="border px-4 py-2">TEST KE</th>
          <th class="border px-4 py-2">Breakdown Voltage (kV)</th>
          </tr>          
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">
                <input
                  type="text"
                  className="w-full border rounded px-1 py-0.5"
                  value={row.value}
                  onChange={e => handleChange(type, index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex space-x-2 mt-2">
        <button
          type='button'
          onClick={() => addRow(type)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + Tambah Baris
        </button>
        <button
          type='button'
          onClick={() => removeRow(type)}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
        >
          − Hapus Baris
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderTable('before', beforeRows)}
      {renderTable('after', afterRows)}
    </div>
  );
}
