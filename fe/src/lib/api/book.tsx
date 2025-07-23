// lib/api/user.ts
import axios from 'axios';

export async function fetchBooks() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/`, {
    withCredentials: true,
  });
  return res.data.data;
}
export async function fetchBookTrending() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/book/trending`, {
    withCredentials: true,
  });
  return res.data.data;
}
