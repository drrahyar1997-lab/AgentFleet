const TOKEN_STORAGE_KEY = 'agentfleet.apiAccessToken';
let tokenPrompt: Promise<string | null> | null = null;

function askForToken(): Promise<string | null> {
  if (!tokenPrompt) {
    tokenPrompt = Promise.resolve(window.prompt('Enter the AgentFleet API access token:'))
      .then((value) => value?.trim() || null)
      .finally(() => { tokenPrompt = null; });
  }
  return tokenPrompt;
}

/** Fetch same-origin API routes, prompting once when the server requires a token. */
export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const url = new URL(input instanceof Request ? input.url : input.toString(), window.location.href);
  if (!url.pathname.startsWith('/api/') || url.pathname === '/api/v1/health') {
    return fetch(input, init);
  }

  const send = (token: string | null) => {
    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const requestInit: RequestInit = { ...init, headers };
    return fetch(input, requestInit);
  };

  let token = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  let response = await send(token);
  if (response.status !== 401) return response;

  token = await askForToken();
  if (!token) return response;
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  response = await send(token);
  if (response.status === 401) {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    window.alert('Invalid API access token. Please try again.');
  }
  return response;
}
