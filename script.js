const apiKey = "42bb0b4c30c742da9f6c5adafa17ac7c";
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

// SEARCH SUBMIT
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        fetchRecipes(query);
    }
});

// FETCH RECIPES
function fetchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&number=12&addRecipeInformation=true`;

    resultsContainer.innerHTML = `<p class="text-center">Loading...</p>`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            if (!data.results || data.results.length === 0) {
                resultsContainer.innerHTML = `<p class="text-danger text-center">No recipes found!</p>`;
                return;
            }
            displayRecipes(data.results);
        })
        .catch((err) => {
            console.error(err);
            resultsContainer.innerHTML = `<p class="text-danger text-center">Error loading recipes.</p>`;
        });
}

// DISPLAY CARDS
function displayRecipes(recipes) {
    let html = "";

    recipes.forEach((r) => {
        html += `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${r.image}" class="card-img-top">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${r.title}</h5>
                    <button class="btn btn-primary mt-auto"
                        data-bs-toggle="modal"
                        data-bs-target="#recipeModal"
                        onclick="fetchRecipeDetails(${r.id})">
                        View Recipe
                    </button>
                </div>
            </div>
        </div>`;
    });

    resultsContainer.innerHTML = html;
}

// FETCH FULL DETAILS
function fetchRecipeDetails(id) {
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

    const modalBody = document.getElementById("recipeModalBody");
    modalBody.innerHTML = "Loading...";

    fetch(url)
        .then((res) => res.json())
        .then((recipe) => {
            displayRecipeDetails(recipe);
        })
        .catch((err) => {
            console.error(err);
            modalBody.innerHTML = `<p class="text-danger">Error loading details.</p>`;
        });
}

// INSERT INTO MODAL
function displayRecipeDetails(recipe) {
    const modalBody = document.getElementById("recipeModalBody");

    const ingredients = recipe.extendedIngredients
        .map((i) => `<li>${i.original}</li>`)
        .join("");

    modalBody.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" class="img-fluid mb-3">

        <h5>Ingredients:</h5>
        <ul>${ingredients}</ul>

        <h5>Instructions:</h5>
        <p>${recipe.instructions || "No instructions available"}</p>
    `;
}
