import { async } from 'regenerator-runtime';

// именнованный экспорт
export const state = {
  recipe: {},
};

// именнованный экспорт
export const loadRecipe = async function (id) {
  try {
    // Ajax запрос к API
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();

    // if ok: false
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Так как есть recipe с обеих сторон, можно использовать Деструктурирующее присваивание { recipe }
    // let recipe = data.data.recipe;
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publesher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      image: recipe.image_url,
    };
    console.log(state.recipe);
  } catch (err) {
    alert(err);
  }
};
