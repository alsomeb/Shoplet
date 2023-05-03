'use strict';
import {
  getProductsByShoppingListId,
  getCurrentSavedShoppingListId,
  getShoppingListById,
} from './api.js';

const currentId = getCurrentSavedShoppingListId();

const unorderedListItemElement = $('.shopping-list');

const productsHeaderElement = $('.products-header');

const buttonsDivElement = $('.buttons');

const jumbotronElement = $('.jumbotron');

const jumboTitleElement = $('.jumbo-title');

const listeners = () => {
  $(document).ready(function () {
    $('.check-btn').on('click', function () {
      alert('Marks done'); // Todo
    });

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
        handleRenderShoppingListInfo(currentId);
      } else {
        // If There are no products in this list created yet
        handleRenderShoppingListInfo(currentId);
      }
    } else {
      // If Error with API fetching
      productsHeaderElement.text('Go back and select list again');
      jumbotronElement.append(`
      <div class="img-fluid">
        <img class="mb-5" src="img/error.png" alt="error-icon" />
      </div>`);
    }
  });
};

const handleRenderShoppingListInfo = (currentId) => {
  getShoppingListById(currentId).then((data) => {
    jumboTitleElement.text(data.added);
    productsHeaderElement.text(data.description);
    buttonsDivElement.append(`
    <button class="btn btn-outline-dark add-product">Add Product</button>`);
    listeners();
  });
};

const modalBtnListener = () => {
  const modaladdbtn = $('#modal-addbtn');

  modaladdbtn.on('click', () => {
    const productName = $('#product-name').val();

    if (productName.length >= 2) {
      console.log('Product Name is >= 2 letters');
    } else {
      console.log('Product Name is Not 2 Letters');
    }
  });
};

handleRenderProductsInShoppingList(currentId);
modalBtnListener();
