export default function LaporanSection({ title, data }) {
  if (!data || data.length === 0) return null;

  let headers = Object.keys(data[0]);
  let modifiedData = [...data];

  // Untuk TTR dan BDV, tambahkan Tap/Test ke
  if (title.toLowerCase().includes('ttr')) {
    headers = ['Tap', ...headers];
    modifiedData = data.map((row, idx) => ({ Tap: idx + 1, ...row }));
  }
  if (title.toLowerCase().includes('bdv')) {
    headers = ['Test ke', ...headers];
    modifiedData = data.map((row, idx) => ({ 'Test ke': idx + 1, ...row }));
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="font-semibold text-lg text-blue-700 mb-2">{title}</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map(h => (
              <th key={h} className="border px-2 py-1">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modifiedData.map((row, i) => (
            <tr key={i}>
              {headers.map(h => (
                <td key={h} className="border px-2 py-1">{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
