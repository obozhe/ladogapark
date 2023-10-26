import a from 'axios';

const axios = a.create({
  baseURL: '/api',
  headers: {
    'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

export default axios;
