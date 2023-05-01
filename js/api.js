const API_URL = 'http://localhost:8080/api/v1/shoppinglists/sort?order=asc';

export async function getAllShoppingLists() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
