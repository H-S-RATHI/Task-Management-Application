import type { User } from "./types"


interface StoredUser extends User {
  password: string
}

interface Session {
  id: string
  userId: string
  expiresAt: number
}

// Register a new user
export async function registerUser(email: string, password: string) {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Registration failed');
    }
    const data = await res.json();
    // Optionally save token to localStorage or cookie
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) {
    throw err;
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Login failed');
    }
    const data = await res.json();
    // Optionally save token to localStorage or cookie
    localStorage.setItem('token', data.token);
    return data.user;
  } catch (err) {
    throw err;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

// Logout user
export async function logoutUser() {
  localStorage.removeItem('token');
  // Optionally, call a backend logout endpoint if you have one
  // await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
  return { success: true };
}
