// // It's Search.js, we can omit the .js in js.
// import str from './models/Search';

// // import {add as a, multiply as m, ID} from './views/searchView';
// import * as searchView from './views/searchView';

// // console.log(`Using imported function! ${add(ID, 2)} and ${multiply(3, 5)}. ${str}`)
// // console.log(`Using imported function! ${a(ID, 2)} and ${m(3, 5)}. ${str}`)
// console.log(`Using imported function! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3, 5)}. ${str}`)

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 * */ 
const state = {};
// testing
// window.state = state;


/**Search Controller
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); 
    // testing
    // const query = 'pizza';

    if(query){
        //2) New search object and add to state
        state.search = new Search(query)
    };

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try{
        
        // 4) Search for recipes
        await state.search.getResults();
    
        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    } catch (err) {
        alert('Something went wrong with the search...');
        clearLoader();
    }
};


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// testing
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });

elements.searchRespages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/**Recipe Controller
 */

/* testing */
// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');
    // console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Highlight selected search Item
       if (state.search) searchView.highlightSelected(id);


        // testing
        // window.r = state.recipe;

        try{
        // Get recipe data and parse ingredient
        await state.recipe.getRecipe();
        // console.log(state.recipe.ingredients);
        state.recipe.parseIngredients();

        // Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id),
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST Controller
 */
const controlList = () => {
    // Create a new list IF there is none yet
    if(!state.list)state.list = new List();

    // Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});



/**
 * LIKE Controller
 */
// Testing
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if(!state.likes)state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

    // User has liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
        // console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
});



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        // * means all the child elements of it, need a space
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add ingredients to shopping list
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        // Like controller
        controlLike();
    };
    // console.log(state.recipe);
});

// testing
// window.l = new List();
