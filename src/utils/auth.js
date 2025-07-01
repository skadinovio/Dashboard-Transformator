// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // decode tanpa verifikasi, cuma baca payload
    const payload = jwtDecode(token);
    return {
      id: payload.id,
      role: payload.role,
      company_id: payload.company_id,
      username: payload.username, // jika ada di token
    };
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
}
