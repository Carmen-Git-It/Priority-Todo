const userAuth = require('./authenticate.js');

export async function addItem(name, due, severity) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: 'PUT',
    body: JSON.stringify({'name': name, 'due': due, 'severity': severity}),
    headers: {
      Authorization : `JWT ${userAuth.getToken()}`
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data;
  } else {
    return [];
  }
}

export async function removeitem(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization : `JWT ${userAuth.getToken()}`
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data;
  } else {
    return [];
  }
}

export async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: 'GET',
    headers: {
      Authorization : `JWT ${userAuth.getToken()}`
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data;
  } else {
    return [];
  }
}

export async function completeItem(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/complete/${id}`, {
    method: 'PUT',
    headers: {
      Authorization : `JWT ${userAuth.getToken()}`
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data
  } else {
    return [];
  }
}

export async function resetItem(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/reset/${id}`, {
    method: 'PUT',
    headers: {
      Authorization : `JWT ${userAuth.getToken()}`
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data
  } else {
    return [];
  }
}