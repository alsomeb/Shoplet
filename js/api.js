const ROOT_URL = 'https://king-prawn-app-twz8n.ondigitalocean.app/';
const test_URL = 'http://localhost:8080/api/v1/shoppinglists/sort?order=asc';

// Get All Shopping Lists
export async function getAllShoppingLists() {
  try {
    const response = await fetch(
      ROOT_URL + 'api/v1/shoppinglists/sort?order=asc'
    );

    const data = await response.json();
    console.log('All lists:');
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

// GET Products in ShoppingList By ListID
export async function getProductsByShoppingListId(listId) {
  const API_URL_BY_ID = ROOT_URL + `api/v1/shoppinglists/${listId}/products`;

  try {
    const response = await fetch(API_URL_BY_ID);
    const data = await response.json();
    console.log(`Products:`);
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

// GET List By ShoppingList ID
export async function getShoppingListById(listId) {
  const API_URL_BY_ID = ROOT_URL + `api/v1/shoppinglists/${listId}`;

  try {
    const response = await fetch(API_URL_BY_ID);
    const data = await response.json();
    console.log(`ShoppingList Data:`);
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export function getCurrentSavedShoppingListId() {
  const currentId = JSON.parse(localStorage.getItem('listId'));
  console.log(`ShoppingList id = ${currentId}`);
  return currentId;
}

// POST
export async function addNewProductPOST(productObject) {
  const shoppingListId = getCurrentSavedShoppingListId();
  const API_URL_POST =
    ROOT_URL + `api/v1/shoppinglists/${shoppingListId}/products`;

  const request = new Request(API_URL_POST, {
    method: 'POST',
    body: JSON.stringify(productObject),
  });

  try {
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

// POST
export async function addNewShoppingListPUT(shoppingListObject) {
  const shoppingListId = 0; // ID spelar ingen roll vid nyskapande sätter 0
  const API_URL_POST = ROOT_URL + `api/v1/shoppinglists/${shoppingListId}`;

  const request = new Request(API_URL_POST, {
    method: 'PUT',
    body: JSON.stringify(shoppingListObject),
  });

  try {
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

// DELETE
export async function deleteShoppingListById(id) {
  const API_URL_DELETE = ROOT_URL + `api/v1/shoppinglists/${id}`;

  const request = new Request(API_URL_DELETE, {
    method: 'DELETE',
  });

  try {
    const response = await fetch(request);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

// Helper functions

// Triggers Reload not really the best but will do the job here
export const refresh = () => {
  window.location.reload();
};
