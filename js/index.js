'use strict';
import { getAllShoppingLists } from './api.js';

// https://mehdiouss.medium.com/how-to-use-async-await-with-the-fetch-api-in-javascript-97cdcca7abbc
// Since getAllShoppingLists() is an asynchronous function,
// it returns a promise. As a result, we used one 'then()' method to handle the promise.

const shoppingListsElement = $('#shopping_lists');

const indexHeaderElement = $('.index-header-text');

const listeners = () => {
  $(document).ready(function () {
    $('.shopping').click(function () {
      let listId = $(this).prop('id');
      localStorage.setItem('listId', JSON.stringify(listId));
    });

    $('.delete').on('click', function () {
      alert('Delete');
    });
  });
};

const handleRenderCards = () => {
  getAllShoppingLists().then((data) => {
    if (data !== undefined) {
      if (data.length > 0) {
        data.forEach((list) => {
          shoppingListsElement.append(`
                  <div class="shoppinglist-column col-lg-4 col-md-6">
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
                          <a class="btn btn-outline-danger delete" href="#">Delete</a>
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

handleRenderCards();
