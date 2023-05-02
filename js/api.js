const API_URL_FETCH_DATE_ASC =
  'http://localhost:8080/api/v1/shoppinglists/sort?order=asc';

export async function getAllShoppingLists() {
  try {
    const response = await fetch(API_URL_FETCH_DATE_ASC);
    const data = await response.json();
    console.log(data); // todo remove
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function getProductsByShoppingListId(listId) {
  const API_URL_BY_ID = `http://localhost:8080/api/v1/shoppinglists/${listId}/products`;

  try {
    const response = await fetch(API_URL_BY_ID);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export function getCurrentSavedShoppingListId() {
  const currentId = JSON.parse(localStorage.getItem('listId'));
  return currentId;
}

// FOR POST
// https://dmitripavlutin.com/fetch-with-json/
