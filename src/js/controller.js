const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// console.log(12 + 38 + 1 + 14); // 09.02.23
console.log(24 + 22); // 10.02.23

const showRecipe = async function () {
  try {
    // Ajax запрос к API
    const res = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await res.json();

    // if ok: false
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Так как есть recipe с обеих сторон, можно использовать Деструктурирующее присваивание { recipe }
    // let recipe = data.data.recipe;
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publesher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);
  } catch (err) {
    alert(err);
  }
};
showRecipe();
