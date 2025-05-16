export async function get(url, params, headers) {
    const response = await fetch(url, {
        method: 'GET',
        headers
    });
    return response.json();
}

export async function post(url, data, headers) {
    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function put(url, data, headers) {
    const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
    });
    return response.json();
}

export async function destroy(url) {
    const response = await fetch(url, {
        method: 'DELETE'
    });
    return response.json();
}