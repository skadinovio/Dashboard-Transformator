import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ModelMetricsCard({ title, metrics, confusionMatrix, accuracy, auc }) {
  const classLabels = Object.keys(metrics);
  const precision = classLabels.map(label => metrics[label].precision);
  const recall = classLabels.map(label => metrics[label].recall);
  const f1 = classLabels.map(label => metrics[label]['f1-score']);

  const chartData = {
    labels: classLabels,
    datasets: [
      { label: 'Precision', data: precision, backgroundColor: '#3b82f6' },
      { label: 'Recall', data: recall, backgroundColor: '#10b981' },
      { label: 'F1-Score', data: f1, backgroundColor: '#eab308' }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Precision / Recall / F1 - ${title}` },
    },
    scales: {
      y: { min: 0, max: 1.1 }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-xs space-x-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Akurasi: {(accuracy * 100).toFixed(2)}%
          </span>
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
            AUC: {auc !== null ? (auc * 100).toFixed(2) + '%' : 'N/A'}
          </span>
        </div>
      </div>

      {/* Grafik Bar */}
      <Bar data={chartData} options={chartOptions} />

      {/* Confusion Matrix */}
      <div>
        <h3 className="font-semibold mb-1 mt-4">Confusion Matrix</h3>
        <table className="text-sm border border-gray-300">
          <thead>
            <tr>
              <th className="border px-2 py-1 bg-gray-100">Actual ↓ / Predict →</th>
              {classLabels.map((label) => (
                <th key={label} className="border px-2 py-1 bg-gray-100">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {confusionMatrix.map((row, i) => (
              <tr key={i}>
                <td className="border px-2 py-1 font-semibold bg-gray-50">{classLabels[i]}</td>
                {row.map((val, j) => (
                  <td key={j} className="border px-3 py-1 text-center">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}