import axios from 'axios';

const HttpClient = axios.create({
  headers: {
    'Content-type': 'application/json',
    // 'Authorization': `Bearer ${userStore.token}`,
  },
});

HttpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // или import userStore без круговой зависимости
  config.headers["X-Api-Key"] = `key`;
  // if (token) {
  //   config.headers['Authorization'] = `Bearer ${token}`;
  // }
  return config;
});

export default HttpClient;