import { useEffect, useState } from 'react';
import Header from '../components/Header';
import clsx from 'clsx';
import ModelMetricsCard from '../components/ModelMetricsCard';

export default function Data() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdminOrTeknisi = ['admin', 'teknisi'].includes(user?.role);

  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState(user?.company_id || '');
  const [year, setYear] = useState(new Date().getFullYear());
  const [prediction, setPrediction] = useState(null);
  const [anomaly, setAnomaly] = useState(null);
  const [error, setError] = useState(null);
  const [mlReports, setMlReports] = useState(null);

  const colorMap = {
    Normal: 'bg-green-100 text-green-800',
    'Perlu Pemeriksaan': 'bg-yellow-100 text-yellow-800',
    'Rawan Gagal': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/ml-evaluation')
      .then(res => res.json())
      .then(data => {
        console.log("📦 ML Reports:", data); // <--- Tambahkan ini
        setMlReports(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isAdminOrTeknisi) return;

    fetch('http://localhost:5000/api/companies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setCompanies)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!token) return;

    const companyParam = isAdminOrTeknisi ? `company=${companyId}` : '';
    const query = `${companyParam}&year=${year}`;
    const urlPrediction = `http://localhost:5000/api/reports/prediction?${query}`;
    const urlAnomaly = `http://localhost:5000/api/reports/anomaly?${query}`;

    fetch(urlPrediction, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        if (!r.ok) throw new Error('Gagal memuat prediksi');
        return r.json();
      })
      .then(d => {
        setPrediction(d.prediction);
        setError(null);
      })
      .catch(err => {
        setPrediction(null);
        setError(err.message);
      });

    fetch(urlAnomaly, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(setAnomaly)
      .catch(() => setAnomaly(null));
  }, [companyId, year, token]);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white overflow-x-hidden p-6 text-gray-800">
      <Header />

      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-4 my-6">
        {isAdminOrTeknisi && (
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Pilih Perusahaan</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-3 py-2 rounded w-32"
        />
      </div>

      <div className="w-full space-y-8">

        {/* Rule-Based Prediction */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-xl font-bold mb-4">Hasil Prediksi (Rule-Based)</h1>
          {error && <p className="text-red-600">{error}</p>}
          {!error && !prediction && <p>Memuat data...</p>}
          {prediction?.rules && (
            <div className="space-y-4">
              {Object.entries(prediction.rules).map(([k, arr]) => (
                <div key={k}>
                  <p className="font-semibold text-blue-800">{k.toUpperCase()}</p>
                  <ul className="list-disc ml-6 text-sm">
                    {arr.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ML Prediction */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-xl font-bold mb-4">Hasil Prediksi (Machine Learning)</h1>
          {!error && !prediction && <p>Memuat data...</p>}
          {prediction && (
            <div className="space-y-2 text-sm">
              {['ml_dt', 'ml_rf', 'ml_svm'].map((key) => {
                const label =
                  key === 'ml_dt' ? 'Decision Tree' :
                  key === 'ml_rf' ? 'Random Forest' : 'SVM';

                const pred = prediction[key];
                const acc = prediction.accuracy?.[key];

                return (
                  <div key={key} className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-2">
                      <p className="w-36 font-medium">{label}</p>
                      <span className={clsx(
                        'px-2 py-1 rounded text-xs font-semibold',
                        colorMap[pred] || 'bg-gray-200 text-gray-800'
                      )}>
                        {pred}
                      </span>
                    </div>

                    {typeof acc === 'number' && (
                      <p className="text-xs text-gray-500">
                        Akurasi: <span className="font-semibold">{(acc * 100).toFixed(2)}%</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Anomali */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Temuan Anomali</h2>
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-600 mb-2">
            {[
              ['bg-green-500', 'Normal'],
              ['bg-yellow-400', 'Perlu Pemeriksaan'],
              ['bg-red-500', 'Rawan Gagal'],
              ['bg-gray-400', 'Data Tidak Valid']
            ].map(([color, label]) => (
              <div className="flex items-center gap-2" key={label}>
                <span className={`w-4 h-4 rounded-full ${color} inline-block`}></span>
                {label}
              </div>
            ))}
          </div>
          {anomaly ? (
            <>
              {renderAnomaliGroup('TTR', anomaly.ttr)}
              {renderAnomaliGroup('Winding Resistance', anomaly.winding)}
              {renderAnomali('Insulation Resistance', anomaly.insulation)}
              {renderAnomaliGroup('BDV', anomaly.bdv)}
            </>
          ) : <p className="text-sm text-gray-500">Tidak ada data anomali.</p>}
        </div>          
        {/* ML Evaluation Metrics */}
        {mlReports && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Evaluasi Model Machine Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(mlReports).map(([modelKey, modelData]) => (
                <ModelMetricsCard
                  key={modelKey}
                  title={modelKey.replace('_', ' ').toUpperCase()}
                  metrics={modelData.classification_report}
                  confusionMatrix={modelData.confusion_matrix}
                  accuracy={modelData.accuracy}
                  auc={modelData.roc_auc}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function getAnomalyStyleFromRules(label, diff, equipmentVoltage = null, insulationResult = null) {
    const lower = label.toLowerCase();

    if (lower.includes('ttr')) {
      if (diff > 0.3) return 'bg-yellow-50 text-yellow-800 border-yellow-500';
      if (diff <= 0.1) return 'bg-green-50 text-green-800 border-green-500';
      return 'bg-red-50 text-red-800 border-red-500';
    }

    if (lower.includes('winding')) {
      if (diff > 3) return 'bg-red-50 text-red-800 border-red-500';
      return 'bg-green-50 text-green-800 border-green-500';
    }

    if (lower.includes('insulation')) {
      if (diff !== 0) return 'bg-red-50 text-red-800 border-red-500';
      return 'bg-green-50 text-green-800 border-green-500';
    }

    if (lower.includes('bdv')) {
      if (diff === 0) return 'bg-gray-50 text-gray-800 border-gray-400';
      if (equipmentVoltage <= 72.5) return diff > 40 ? 'bg-green-50 text-green-800 border-green-500'
        : diff >= 30 ? 'bg-yellow-50 text-yellow-800 border-yellow-500'
        : 'bg-red-50 text-red-800 border-red-500';
      if (equipmentVoltage < 270) return diff > 50 ? 'bg-green-50 text-green-800 border-green-500'
        : diff >= 40 ? 'bg-yellow-50 text-yellow-800 border-yellow-500'
        : 'bg-red-50 text-red-800 border-red-500';
      return diff > 60 ? 'bg-green-50 text-green-800 border-green-500'
        : diff >= 50 ? 'bg-yellow-50 text-yellow-800 border-yellow-500'
        : 'bg-red-50 text-red-800 border-red-500';
    }

    return 'bg-gray-100 text-gray-800 border-gray-400';
  }

  function renderAnomali(label, diff) {
    if (typeof diff !== 'number' || Number.isNaN(diff)) return null;
    const style = getAnomalyStyleFromRules(label, diff);
    const abs = Math.abs(diff);
    return (
      <div className={clsx('p-4 rounded-lg mb-3 border-l-4', style)}>
        <p className="font-bold">{label}</p>
        <p className="text-sm">
          Perubahan {diff > 0 ? 'naik' : 'turun'} sebesar <strong>{abs.toFixed(2)}</strong>
        </p>
      </div>
    );
  }

  function renderAnomaliGroup(label, obj) {
    if (!obj || typeof obj !== 'object') return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(obj).map(([key, val]) => (
          <div key={key}>{renderAnomali(`${label} - ${key.toUpperCase()}`, val)}</div>
        ))}
      </div>
    );
  }
}
