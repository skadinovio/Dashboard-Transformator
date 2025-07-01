import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const KOP = '/images/kop.png';
const KOP_WIDTH = 180;
const KOP_HEIGHT = 25;

export default function ExportPDF({ report }) {
  const today = new Date().toLocaleDateString('id-ID');

  const addLetterHead = async (doc) => {
    const img = await loadImage(KOP);
    doc.addImage(img, 'PNG', 15, 10, KOP_WIDTH, KOP_HEIGHT);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${today}`, 160, 38, { align: 'right' });
  };

  const loadImage = (url) =>
    new Promise((res) => {
      const img = new Image();
      img.src = url;
      img.onload = () => res(img);
    });

  const handleExportPDF = async () => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const info = report.transformator_info?.[0] || {};

    const pages = [
      {
        title: 'TTR',
        blocks: [{ label: 'TTR', data: report.data.ttr, head: buildTable('TTR').head, body: buildTable('TTR', report.data.ttr).body }]
      },
      {
        title: 'Winding Resistance',
        blocks: [
          { label: 'HV', data: report.data.winding_hv, ...buildTable('Winding Resistance HV', report.data.winding_hv) },
          { label: 'LV', data: report.data.winding_lv, ...buildTable('Winding Resistance HV', report.data.winding_lv) }
        ]
      },
      {
        title: 'Insulation Resistance',
        blocks: [
          { label: 'Insulation', data: report.data.insulation, ...buildTable('Insulation Resistance', report.data.insulation) }
        ]
      },
      {
        title: 'BDV',
        blocks: [
          { label: 'Before', data: report.data.bdv_before, ...buildTable('BDV After', report.data.bdv_before) },
          { label: 'After', data: report.data.bdv_after, ...buildTable('BDV After', report.data.bdv_after) }
        ]
      }
    ];

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) doc.addPage();
      await addLetterHead(doc);
      let y = 50;

      for (const blk of pages[i].blocks) {
        doc.setFontSize(12);
        doc.text(blk.label, 15, y - 4);

        autoTable(doc, {
          startY: y,
          head: [['MVA', 'Rate Voltage', 'Freq', 'Conn', 'Phases']],
          body: [[
            info.mva_rating ?? '-', info.rate_voltage ?? '-',
            info.frequency ?? '-', info.connection ?? '-', info.phases ?? '-'
          ]],
          theme: 'grid',
          styles: { textColor: 0 }
        });

        const afterInfoY = doc.lastAutoTable.finalY + 6;
        autoTable(doc, {
          startY: afterInfoY,
          head: [blk.head],
          body: blk.body,
          theme: 'grid',
          styles: { textColor: 0 }
        });

        y = doc.lastAutoTable.finalY + 10;
      }
    }

    doc.save(`Laporan-Trafo-${today}.pdf`);
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const info = report.transformator_info?.[0] || {};
    const today = new Date().toLocaleDateString('id-ID');

    const makeSheet = (title, head, data) => {
      const aoa = [
        ['SISTEM MONITORING TRANSFORMATOR'],
        [`Tanggal: ${today}`],
        [],
        ['Info Trafo:'],
        ['MVA', 'Rate Voltage', 'Frequency', 'Connection', 'Phases'],
        [info.mva_rating, info.rate_voltage, info.frequency, info.connection, info.phases],
        [],
        [title],
        head,
        ...data
      ];
      return XLSX.utils.aoa_to_sheet(aoa);
    };

    wb.SheetNames = [];
    wb.Sheets = {};

    const sheets = [
      ['TTR', 'TTR', report.data.ttr],
      ['Winding HV', 'Winding Resistance HV', report.data.winding_hv],
      ['Winding LV', 'Winding Resistance HV', report.data.winding_lv],
      ['Insulation', 'Insulation Resistance', report.data.insulation],
      ['BDV Before', 'BDV After', report.data.bdv_before],
      ['BDV After', 'BDV After', report.data.bdv_after]
    ];

    sheets.forEach(([sheetName, tableType, data]) => {
      const { head, body } = buildTable(tableType, data);
      const ws = makeSheet(sheetName, head, body);
      XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
    });

    const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Laporan-Trafo-${today}.xlsx`);
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleExportPDF} className="bg-blue-600 text-white px-4 py-1 rounded">
        Export PDF
      </button>
      <button onClick={handleExportExcel} className="bg-green-600 text-white px-4 py-1 rounded">
        Export Excel
      </button>
    </div>
  );
}

// ---- helper bangun kolom otomatis ----
function buildTable(section, data = []) {
  switch (section) {
    case 'TTR':
      return {
        head: ['Tap', 'Primer', 'Sec', 'Theory', 'n-a', 'Error a', 'n-b', 'Error b', 'n-c', 'Error c'],
        body: data.map((d, i) => [
          i + 1, d.primer, d.sec, d.theory,
          d.n_a, d.error_a, d.n_b, d.error_b, d.n_c, d.error_c
        ])
      };
    case 'Winding Resistance HV':
      return {
        head: ['Tap', 'Phasa A', 'Phasa B', 'Phasa C', 'Deviasi'],
        body: data.map((d, i) => [i + 1, d.phasa_a, d.phasa_b, d.phasa_c, d.deviasi])
      };
    case 'Insulation Resistance':
      return {
        head: ['No', 'Test Point', 'Voltage', 'Result'],
        body: data.map((d, i) => [i + 1, d.test_point, d.voltage, d.result])
      };
    case 'BDV After':
      return {
        head: ['Test Ke', 'Breakdown Voltage (kV)'],
        body: data.map((d, i) => [i + 1, d.value])
      };
    default:
      return { head: [], body: [] };
  }
}
