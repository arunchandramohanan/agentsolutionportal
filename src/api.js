const BASE = import.meta.env.VITE_API_URL || '';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

export const api = {
  getSolutions: () => get('/api/solutions'),
  getSolution: (id) => get(`/api/solutions/${id}`),
  getFeatured: () => get('/api/solutions/featured'),
  getIndustries: () => get('/api/industries'),
  getStacks: () => get('/api/stacks'),
  getCollections: () => get('/api/collections'),
  getCollection: (id) => get(`/api/collections/${id}`),
  submitSolution: (data) => post('/api/submissions', data),
};
