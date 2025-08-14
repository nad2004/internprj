// controllers/google.controller.js
import axios from 'axios';

const FIELDS =
  'items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/imageLinks/thumbnail,volumeInfo/industryIdentifiers,volumeInfo/categories)';

// helper: rút gọn xuống 5 trường cần dùng + id để bạn biết item nào
function normalizeItem(item) {
  const v = item?.volumeInfo ?? {};
  const category = Array.isArray(v.categories) && v.categories.length ? v.categories[0] : '';

  const title = v.title ?? '';
  const author = Array.isArray(v.authors) && v.authors.length ? v.authors[0] : '';
  const date = v.publishedDate ?? '';
  const description = v.description ?? '';
  const thumbnail = v.imageLinks?.thumbnail ?? '';
  const isbn13 = v.industryIdentifiers?.find((x) => x.type === 'ISBN_13')?.identifier ?? '';

  //   console.log(v);

  return {
    id: item.id,
    title,
    author,
    category,
    date,
    description,
    thumbnail,
  };
}

export async function searchGoogleBooks(req, res) {
  try {
    const q = String(req.query.q || '').trim();
    const maxResults = Math.min(Number(req.query.maxResults || 10), 40); // google max 40

    if (!q) {
      return res.status(400).json({ message: 'Missing query q' });
    }

    const url = new URL('https://www.googleapis.com/books/v1/volumes');
    url.searchParams.set('q', q);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('printType', 'books');
    url.searchParams.set('fields', FIELDS);
    url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
    const r = await axios.get(url.toString(), {
      timeout: Number(process.env.GOOGLE_BOOKS_TIMEOUT_MS || 8000),
    });

    const items = Array.isArray(r.data?.items) ? r.data.items : [];
    const simplified = items.map(normalizeItem);

    return res.json({ data: simplified });
  } catch (err) {
    console.error('[GoogleBooks] search error:', err?.message);
    return res.status(502).json({ message: 'Upstream Google Books error' });
  }
}
