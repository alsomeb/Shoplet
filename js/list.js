'use strict';
import { getProductsByShoppingListId } from './api.js';

getProductsByShoppingListId(10001).then((data) => {
  console.log(data);
});
