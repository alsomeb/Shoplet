'use strict';
import {
  getProductsByShoppingListId,
  getCurrentSavedShoppingListId,
  getShoppingListById,
  addNewProductPOST,
} from './api.js';

const currentId = getCurrentSavedShoppingListId();

const unorderedListItemElement = $('.shopping-list');

const productsHeaderElement = $('.products-header');

const buttonsDivElement = $('.buttons');

const jumbotronElement = $('.jumbotron');

const jumboTitleElement = $('.jumbo-title');

const titleElement = $('#exampleModalLabel');

const productName = $('#product-name');
const amount = $('#amount');

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
  // Fetch ShoppingListById from API
  getShoppingListById(currentId).then((data) => {
    jumboTitleElement.text(data.added);
    productsHeaderElement.text(data.description);
    buttonsDivElement.append(`
    <button
    type="button"
    class="btn btn-outline-dark"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
    id="modalBtn">
        Add Product
    </button>
    `);
    listeners();
  });
};

// Checks if all bools in array are true
const handleValidateFields = (arrayOfBools) => {
  let fieldsAreValid = arrayOfBools.every((item) => item === true);
  return fieldsAreValid;
};

// Animation + Text Style For Error in Modal Title
const handleErrorAnimation = () => {
  titleElement.text('Check Fields');
  titleElement.css('color', 'red');
  titleElement.slideUp().slideDown();
};

// Resets Modal Title + fields If
const handleResetModal = () => {
  titleElement.text('New Product');
  titleElement.css('color', 'black');
  productName.val('');
  amount.val('');

  // Trigger a click to get rid of modal
  $('.btn-close').trigger('click');
};

// Bundles ProductObject For POSTING the API
const handlePostNewProduct = () => {
  const product = {
    name: productName.val(),
    amount: amount.val(),
  };
  addNewProductPOST(product).then(() => {
    handleResetModal();
  });
};

// Handles Error msg if there are any else POST new Product To API
const handleErrorMessage = (formIsValid) => {
  if (formIsValid) {
    handlePostNewProduct();
  } else {
    handleErrorAnimation();
  }
};

// Listener Modal Button
const modalBtnListener = () => {
  const modaladdbtn = $('#modal-addbtn');

  modaladdbtn.on('click', () => {
    const productNameValue = productName.val();
    const amountValue = amount.val();

    const isValidProductName = productNameValue.length >= 2 ? true : false;
    const isValidAmount = amountValue >= 2 ? true : false;

    let formIsValid = handleValidateFields([isValidProductName, isValidAmount]);

    handleErrorMessage(formIsValid);
  });
};

handleRenderProductsInShoppingList(currentId);
modalBtnListener();
