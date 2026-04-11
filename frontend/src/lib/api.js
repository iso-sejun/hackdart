const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = payload?.error?.message || 'Something went wrong';
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not reach the API at ${API_BASE_URL}. Make sure the Express server is running and MongoDB credentials are valid.`
      );
    }

    throw error;
  }
}

export function withAuth(token, options = {}) {
  return {
    ...options,
    token,
  };
}
