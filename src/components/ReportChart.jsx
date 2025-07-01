import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: title }
  }
});

export default function ReportChart({ report }) {
  const { ttr, winding_hv, winding_lv, insulation, bdv_before, bdv_after } = report?.data || {};
  console.log('TTR', ttr);
  console.log('Winding HV', winding_hv);
  console.log('Winding LV', winding_lv);
  console.log('BDV Before', bdv_before);
  console.log('BDV After', bdv_after);

  // 🟥 TTR
  const ttrChart = ttr?.length > 0 && {
    labels: ttr.map((item, i) => `TAP ${i + 1}`),
    datasets: [
      {
        label: 'Error A',
        data: ttr.map(item => parseFloat(item.error_a.replace(',', '.'))),
        borderColor: 'red',
        tension: 0.3,
      },
      {
        label: 'Error B',
        data: ttr.map(item => parseFloat(item.error_b.replace(',', '.'))),
        borderColor: 'orange',
        tension: 0.3,
      },
      {
        label: 'Error C',
        data: ttr.map(item => parseFloat(item.error_c.replace(',', '.'))),
        borderColor: 'green',
        tension: 0.3,
      }
    ]
  };

  // 🟦 Winding HV
  const windingHVChart = winding_hv?.length > 0 && {
    labels: winding_hv.map((_, i) => `Tap ${i + 1}`),
    datasets: [
      {
        label: 'Deviasi',
        data: winding_hv.map(item => parseFloat(item.deviasi.replace(',', '.'))),
        borderColor: '#3b82f6',
        tension: 0.3,
      }
    ]
  };

  // 🟪 Winding LV
  const windingLVChart = winding_lv?.length > 0 && {
    labels:
      winding_lv.length === 1
        ? ['Tap 1', 'Tap 2'] // Buat dua label untuk garis horizontal
        : winding_lv.map((_, i) => `Tap ${i + 1}`),

    datasets: [
      {
        label: 'Deviasi',
        data:
          winding_lv.length === 1
            ? [
                parseFloat(winding_lv[0].deviasi.replace(',', '.')),
                parseFloat(winding_lv[0].deviasi.replace(',', '.')),
              ]
            : winding_lv.map(item =>
                parseFloat(item.deviasi.replace(',', '.'))
              ),

        borderColor: '#8b5cf6',
        tension: 0.3,
        fill: false,
      },
    ],
  };


  // 🟩 Insulation Resistance (Bar)
  const insulationChart = insulation?.length > 0 && {
    labels: insulation.map(item => item.test_point),
    datasets: [
      {
        label: 'Result',
        data: insulation.map(item => parseFloat(item.result.replace(',', '.'))),
        backgroundColor: insulation.map((_, i) => {
          const colors = [
            '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
            '#8b5cf6', '#14b8a6', '#eab308', '#f97316'
          ];
          return colors[i % colors.length]; // Ulangi jika lebih dari 8 data
        }),
        borderRadius: 6,
      }
    ]
  };

  // 🟧 BDV Before
  const bdvBeforeChart = bdv_before?.length > 0 && {
    labels: bdv_before.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'BDV Before',
        data: bdv_before.map(item => parseFloat(item.value.replace(',', '.'))),
        borderColor: '#f59e0b',
        tension: 0.3,
      }
    ]
  };

  // 🟦 BDV After
  const bdvAfterChart = bdv_after?.length > 0 && {
    labels: bdv_after.map((_, i) => `Test ${i + 1}`),
    datasets: [
      {
        label: 'BDV After',
        data: bdv_after.map(item => parseFloat(item.value.replace(',', '.'))),
        borderColor: '#10b981',
        tension: 0.3,
      }
    ]
  };

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {ttrChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Line data={ttrChart} options={chartOptions('Grafik TTR (Error A, B, C)')} />
      </div>
    )}

    {windingHVChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Line data={windingHVChart} options={chartOptions('Grafik Winding Resistance HV')} />
      </div>
    )}

    {windingLVChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Line data={windingLVChart} options={chartOptions('Grafik Winding Resistance LV')} />
      </div>
    )}

    {insulationChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Bar data={insulationChart} options={chartOptions('Grafik Insulation Resistance')} />
      </div>
    )}

    {bdvBeforeChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Line data={bdvBeforeChart} options={chartOptions('Grafik BDV Before')} />
      </div>
    )}

    {bdvAfterChart && (
      <div className="bg-white p-4 rounded-xl shadow">
        <Line data={bdvAfterChart} options={chartOptions('Grafik BDV After')} />
      </div>
    )}
  </div>
 );
}