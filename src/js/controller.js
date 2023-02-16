import * as model from './model.js'; // импорт всего
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// // Горячая загрузка
// if (module.hot) {
//   module.hot.accept;
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. Обновление вида результатов, что бы отменить выбранные результат поиска
    resultsView.update(model.getSearchResultsPage());

    // 1. Обновление вида закладки
    bookmarksView.update(model.state.bookmarks);

    // 2. Загружаем рецепт
    // Асинхронная функция вызывает другую асинхронную функцию
    // Асинхронная функция возврощает обещание, которое нужно обработать при вызове этой асинхронной функции, await и заставляет JavaScript дожидаться выполнения промиса
    await model.loadRecipe(id);

    // 3. Рендеринг рецепта
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1. Добавить.удалить закладку
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Обновить вид рецепта
  recipeView.update(model.state.recipe);

  // 3. Отображение закладки
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Показать спинер загрузки
    addRecipeView.renderSpinner();

    // Загрузка новых рецептов
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Отображение рецепта
    recipeView.render(model.state.recipe);

    // Сообщение об успехе
    addRecipeView.renderMessage();

    // Визуализировать вид закладки
    bookmarksView.render(model.state.bookmarks);

    // Изменить ID в URL
    // Аргументы 1. состояние, 2. Заголовок, 3. URL -
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back() // автоматическое возвращение на последнюю страницу

    // Закрыть окно формы
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
