import * as model from './model.js'; // импорт всего
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// // Горячая загрузка
// if (module.hot) {
//   module.hot.accept;
// }

const controlRecipes = async function () {
  try {
    // 1. Получить поисковый запрос
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 2. Загружаем рецепт
    // Асинхронная функция вызывает другую асинхронную функцию
    // Асинхронная функция возврощает обещание, которое нужно обработать при вызове этой асинхронной функции, await и заставляет JavaScript дожидаться выполнения промиса
    await model.loadRecipe(id);

    // 3. Рендеринг рецепта
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. получаем поисковой запрос
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Загрузить результат поиска
    await model.loadSearchResults(query);

    // 3. Результат рендеринга
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // 4. Отобразить кнопки начальной пагинации
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Результат нового рендеринга
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2. Отобразить кнопки новой пагинации
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // обновите порции рецепта (по состоянию).
  model.updateServings(newServings);

  // обновите отображение рецепта
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
