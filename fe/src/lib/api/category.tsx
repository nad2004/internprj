import axios from 'axios';
export async function fetchCategories() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/category/`, {
    withCredentials: true,
  });
  return res.data.data;
}
