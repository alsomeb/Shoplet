'use strict';
import {
  getProductsByShoppingListId,
  getCurrentSavedShoppingListId,
  getShoppingListById,
  addNewProductPOST,
  refresh,
} from './api.js';

const currentId = getCurrentSavedShoppingListId();
const cartId = `cart-${currentId}`;

const unorderedListItemElement = $('.shopping-list');

const productsHeaderElement = $('.products-header');

const buttonsDivElement = $('.buttons');

const jumbotronElement = $('.jumbotron');

const jumboTitleElement = $('.jumbo-title');

const titleElement = $('#exampleModalLabel');

const productName = $('#product-name');
const amount = $('#amount');

const listeners = () => {
  $('.check-btn').on('click', function () {
    const productId = this.id;
    handleMarkItemDone(productId);
  });
};

const handleMarkItemDone = (id) => {
  const itemId = `#product-${id}`;
  const element = $(itemId);
  $(element).toggleClass('line');
  toggleItemSavedInLocalStorage(id);
};

const handleRenderProductIsChecked = (productId) => {
  const storage = JSON.parse(localStorage.getItem(cartId));
  const product = storage.find((item) => item.id === productId);
  if (product.isChecked) {
    const itemId = `#product-${productId}`;
    $(itemId).addClass('line');
  }
};

const handleRenderProductsInShoppingList = (currentId) => {
  getProductsByShoppingListId(currentId).then((data) => {
    if (data !== undefined && currentId !== null) {
      if (data.length > 0) {
        data.forEach((product) => {
          // save products for LS - So we can save state if they have been checked or not
          appendItemToCartStorage(product, data.length);
          unorderedListItemElement.append(`
          <li id="product-${product.id}">
            ${product.amount}x ${product.name}
            <button class="btn check-btn" id="${product.id}">
              <i class="fa-solid fa-check"></i>
            </button>
          </li>`);

          handleRenderProductIsChecked(Number(product.id));
        });
        handleRenderShoppingListInfo(currentId);
        listeners();
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
  productName.css('border-color', 'red');
  amount.css('border-color', 'red');
  titleElement.slideUp().slideDown();
};

// Resets Modal Title + fields If
const handleResetModal = () => {
  titleElement.text('New Product');
  titleElement.css('color', 'black');
  productName.css('border-color', '#ced4da');
  amount.css('border-color', '#ced4da');
  productName.val('');
  amount.val('');

  // Close Modal
  $('#exampleModal').modal('hide');
};

// Bundles ProductObject For POSTING the API
const handlePostNewProduct = () => {
  const product = {
    name: productName.val().trim(),
    amount: amount.val().trim(),
  };
  addNewProductPOST(product).then(() => {
    handleResetModal();
    localStorage.removeItem(cartId); // den kommer ändå refreshas när vi rerender sidan, detta löste id conflict i localstorage
    refresh();
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

// handle save products cart to LocalStorage
const appendItemToCartStorage = (product, sizeOfData) => {
  const storage = JSON.parse(localStorage.getItem(cartId));

  if (storage === null) {
    const cart = [
      {
        id: product.id,
        isChecked: false,
      },
    ];
    localStorage.setItem(cartId, JSON.stringify(cart));
  } else if (storage.length < sizeOfData) {
    const cartUpd = {
      id: product.id,
      isChecked: false,
    };

    const newCartToSave = [...storage, cartUpd];
    localStorage.setItem(cartId, JSON.stringify(newCartToSave));
  }
};

const handleSaveMarkedItemChecked = (isChecked, storage, productId) => {
  const oldArray = storage.filter((item) => item.id !== productId);

  const cartUpd = {
    id: productId,
    isChecked: isChecked,
  };
  const newCartToSave = [...oldArray, cartUpd];

  localStorage.setItem(cartId, JSON.stringify(newCartToSave));
};

// filtrera ut så vi har old array sen anv spread operator för att bygga nya cart med det item som var checkad blir true
// Detta blir som en toggle effekt
const toggleItemSavedInLocalStorage = (productId) => {
  const storage = JSON.parse(localStorage.getItem(cartId));
  const numberId = Number(productId);
  const itemToSave = storage.find((item) => item.id === numberId);

  if (storage !== null && itemToSave.isChecked === false) {
    handleSaveMarkedItemChecked(true, storage, numberId);
  } else if (itemToSave.isChecked) {
    handleSaveMarkedItemChecked(false, storage, numberId);
  }
};

// Listener Modal Button
const modalBtnListener = () => {
  const modaladdbtn = $('#modal-addbtn');

  modaladdbtn.on('click', () => {
    const productNameValue = productName.val().trim();
    const amountValue = amount.val().trim();

    // Field Validation Bools
    const isValidProductName = productNameValue.length >= 2 ? true : false;
    const isValidAmount = amountValue >= 1 ? true : false;

    let formIsValid = handleValidateFields([isValidProductName, isValidAmount]);

    handleErrorMessage(formIsValid);
  });
};

handleRenderProductsInShoppingList(currentId);
modalBtnListener();
