import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Unauthorized() {
    useEffect(()=>{
      document.title ="Unauthorized"
    })
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="text-gray-600">Anda tidak punya akses ke halaman ini.</p>
      <Link to="/" className="text-blue-600 underline">
        Kembali ke Login
      </Link>
    </div>
  );
}