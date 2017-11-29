var rest = require('../API/Restclient');

exports.displayFavouriteCurrency = function getFavouriteCurrency(session, username){
    var url = 'https://foodapp123.azurewebsites.net/tables/currencybot';
    rest.getFavouriteCurrency(url, session, username, handleFavouriteCurrencyResponse)
};

// exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
//     var url = 'https://foodapp123.azurewebsites.net/tables/FoodBot';
//     rest.postFavouriteFood(url, username, favouriteFood);
// };


// exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
//     var url  = 'https://foodapp123.azurewebsites.net/tables/FoodBot';


//     rest.getFavouriteFood(url,session, username,function(message,session,username){
//      var   allFoods = JSON.parse(message);

//         for(var i in allFoods) {

//             if (allFoods[i].favouriteFood === favouriteFood && allFoods[i].username === username) {


//                 rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id ,handleDeletedFoodResponse)

//             }
//         }


//     });


// };


// function handleDeletedFoodResponse(body,session,username, favouriteFood){

//         console.log('Done');


//}


function handleFavouriteCurrencyResponse(message, session, username) {
    var favouriteCurrencyResponse = JSON.parse(message);
    var allCurrency = [];
    for (var index in favouriteCurrencyResponse) {
        var usernameReceived = favouriteCurrencyResponse[index].username;
        console.log(favouriteCurrencyResponse[index]);
        var favouriteCurrency = favouriteCurrencyResponse[index].favouriteCurrency;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(favouriteCurrencyResponse.length - 1) {
                allCurrency.push(favouriteCurrency);
            }
            else {
                allCurrency.push(favouriteCurrency + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your favourite foods are: %s", username, allCurrency);                
    
}
