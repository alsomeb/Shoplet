'use strict';
import { getAllShoppingLists, deleteShoppingListById, refresh } from './api.js';

// https://mehdiouss.medium.com/how-to-use-async-await-with-the-fetch-api-in-javascript-97cdcca7abbc
// Since getAllShoppingLists() is an asynchronous function, it returns a promise. As a result, we used one 'then()' method to handle the promise.

const shoppingListsElement = $('#shopping_lists');

const indexHeaderElement = $('.index-header-text');

const addListButton = $('#add-list');

const inputElementShoppingList = $('#list-name');

const inputElementDate = $('#date');

const titleElement = $('#exampleModalLabel');

const modalAddButton = $('#exampleModal');

const listeners = () => {
  $('.shopping').click(function () {
    let listId = $(this).prop('id');
    localStorage.setItem('listId', JSON.stringify(listId));
  });

  $('.delete').on('click', function () {
    const buttonElementId = this.id;
    const index = buttonElementId.lastIndexOf('-') + 1;
    const shoppingListId = buttonElementId.substring(index);
    deleteShoppingListById(shoppingListId);
    refresh();
  });
};

const handleRenderCards = () => {
  getAllShoppingLists().then((data) => {
    if (data !== undefined) {
      if (data.length > 0) {
        data.forEach((list) => {
          shoppingListsElement.append(`
                  <div class="shoppinglist-column col-lg-4 col-md-6 my-3" id="card-${list.id}">
                  <div class="card shadow">
                    <div class="card-header fw-bold text-center">${list.added}</div>
                    <div class="card-body text-center">
                      <p class="lead mt-2">${list.description}</p>
                    </div>
                    <div class="card-footer">
                      <div class="update-buttons">
                        <div class="box">
                          <a id="${list.id}" class="btn btn-outline-dark shopping" href="/list.html"
                            >Start shopping</a
                          >
                          <button class="btn btn-outline-danger delete" id="list-${list.id}">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  `);
        });
        listeners();
      } else {
        // If There are no shopping lists created yet
        indexHeaderElement.text('No Shoppinglists yet, create one!');
        shoppingListsElement.append(`
        <div class="empty-list-container mt-4">
        <div class="img-fluid">
          <img class="w-25" src="img/grocery-cart.png" alt="grocery-cart" />
        </div>
          <button class="btn btn-outline-dark mt-5">Add Shopping List</button>
        </div>
        `);
      }
    } else {
      // If Error with API fetching
      indexHeaderElement.text(
        'There was an Error Fetching From API, Contact Alex'
      );
      shoppingListsElement.append(`
      <div class="img-fluid">
        <img src="img/error.png" alt="error-icon" />
      </div>
      `);
    }
  });
};

const modalListenr = () => {
  addListButton.click(function () {
    modalAddButton.modal('show');
  });
};

// Checks if all bools in array are true
const handleValidateFields = (arrayOfBools) => {
  let fieldsAreValid = arrayOfBools.every((item) => item === true);
  return fieldsAreValid;
};

const handleResetModal = () => {
  titleElement.text('New Shopping List');
  titleElement.css('color', 'black');
  inputElementShoppingList.css('border-color', '#ced4da');
  inputElementDate.css('border-color', '#ced4da');
  inputElementShoppingList.val('');
  inputElementDate.val('');

  // Close Modal
  $('#exampleModal').modal('hide');
};

// Handles Error msg if there are any else POST new Product To API
const handleErrorMessage = (formIsValid) => {
  if (formIsValid) {
    console.log('FORM IS VALID');
    handleResetModal();
  } else {
    handleErrorAnimation();
  }
};

// Animation + Text Style For Error in Modal Title
const handleErrorAnimation = () => {
  titleElement.text('Check Fields');
  titleElement.css('color', 'red');
  inputElementShoppingList.css('border-color', 'red');
  inputElementDate.css('border-color', 'red');
  titleElement.slideUp().slideDown();
};

// Listener Modal Button
const modalAddNewShoppingList = () => {
  const modaladdbtn = $('#modal-addbtn');

  modaladdbtn.on('click', () => {
    const shoppingListNameValue = inputElementShoppingList.val().trim();
    const date = inputElementDate.val();

    const currDate = new Date();
    currDate.setHours(0, 0, 0, 0); // annars fattar den inte när den jämför
    const inputDate = new Date(date);

    // Field Validation Bools
    const isValidName = shoppingListNameValue.length >= 2 ? true : false;
    const isValidDate =
      inputDate.getTime() >= currDate.getTime() ? true : false;

    let formIsValid = handleValidateFields([isValidName, isValidDate]);

    handleErrorMessage(formIsValid);
  });
};

handleRenderCards();
modalAddNewShoppingList();
modalListenr();
