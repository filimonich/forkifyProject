import * as model from './model.js'; // импорт всего
import recipeView from './views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

//////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner(recipeContainer);

    // 1) Загружаем рецепт
    // Асинхронная функция вызывает другую асинхронную функцию
    // Асинхронная функция возврощает обещание, которое нужно обработать при вызове этой асинхронной функции, await и заставляет JavaScript дожидаться выполнения промиса
    await model.loadRecipe(id);

    // 2) Рендеринг рецепта
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};
init();
