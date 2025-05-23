export default class HttpService {
  async get(url, params, headers) {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });
    return response.json();
  }
  async post(url, data, headers) {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }
  async destroy(url) {
    const response = await fetch(url, {
      method: "DELETE",
    });
    return response.json();
  }
  async put(url, data, headers) {
    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
