import axios from 'axios';
export async function fetchUsers() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
    withCredentials: true,
  });
  return res.data.data;
}
