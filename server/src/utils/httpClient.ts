export class HttpClient {
  
  // GET
  static async get(url: string, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { method: 'GET', headers });

    // custom 404 err
    if (response.status === 404) return []; 
    
    // 500 for another err
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  }

  // POST
  static async post(url: string, body: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  }
}