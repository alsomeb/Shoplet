'use strict';
import {
  getProductsByShoppingListId,
  getCurrentSavedShoppingListId,
} from './api.js';

const currentId = getCurrentSavedShoppingListId();

const unorderedListItemElement = $('.shopping-list');

const productsHeaderElement = $('.products-header');

const listanElement = $('.listan');

const jumbotronElement = $('.jumbotron');

const jumboTitleElement = $('.jumbo-title');

const listenerIfProducts = () => {
  $(document).ready(function () {
    $('.check-btn').on('click', function () {
      alert('Marks done'); // Todo
    });
  });
};

const listenerIfNoProducts = () => {
  $(document).ready(function () {
    $('.add-product').on('click', function () {
      alert('Add goes here'); // Todo
    });
  });
};

const handleRenderProductsInShoppingList = (currentId) => {
  getProductsByShoppingListId(currentId).then((data) => {
    if (data !== undefined && currentId !== null) {
      if (data.length > 0) {
        data.forEach((product) => {
          unorderedListItemElement.append(`
          <li>
            ${product.amount}x ${product.name}
            <button class="btn check-btn">
              <i class="fa-solid fa-check"></i>
            </button>
          </li>`);
        });
        handleGetShoppingListDate(currentId);
        listenerIfProducts();
      } else {
        // If There are no products in this list created yet
        handleGetShoppingListDate(currentId);
        productsHeaderElement.text('Add some products!');
        listanElement.append(`
        <div class="listan">
          <button class="btn btn-outline-dark mb-5 add-product">Add Product</button>
        </div>
        `);
        listenerIfNoProducts();
      }
    } else {
      // If Error with API fetching
      productsHeaderElement.text('Go back and select list again');
      jumbotronElement.append(`
      <div class="img-fluid">
        <img class="mb-5" src="img/error.png" alt="error-icon" />
      </div>
      <a href ="/index.html" class="btn btn-outline-danger mb-5">Go back</a>
      `);
    }
  });
};

const handleGetShoppingListDate = (currentId) => {
  // todo use currentId from shopping list and fetch date
  jumboTitleElement.text('Datum todo');
};

handleRenderProductsInShoppingList(currentId);
