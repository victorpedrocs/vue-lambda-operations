import { useAuthStore } from '@/stores';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

function request(method: string) {
  return async (url: string, body?: any, query?: Record<string, any>) => {
    const config: RequestInit = {
      method,
      headers: authHeader(url),
    };
    let querystring = '';

    if (body) {
      config.body = JSON.stringify(body);
      config.headers = {
        ...config.headers,
        ['Content-Type']: 'application/json',
      };
    }
    if (query) {
      const params = new URLSearchParams(query);
      for (const [key, value] of params) {
        if (value === undefined || value === null || value === '') {
          params.delete(key);
        }
      }
      querystring = params.toString();
    }

    return fetch(`${url}?${querystring}`, config).then(handleResponse);
  };
}

function authHeader(url: string): Record<string, string> {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

/**
 * When an error occur, rejects only with the message
 */
async function handleResponse(response: Response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { user, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
