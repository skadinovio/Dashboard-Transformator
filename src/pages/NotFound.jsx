import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-xl">Halaman tidak ditemukan</p>
      <Link to="/" className="text-blue-600 underline">
        Kembali ke Beranda
      </Link>
    </div>
  );
}