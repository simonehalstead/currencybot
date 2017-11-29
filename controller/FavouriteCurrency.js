var rest = require('../API/Restclient');

exports.displayFavouriteCurrency = function getFavouriteCurrency(session, username){
    var url = 'https://foodapp123.azurewebsites.net/tables/currencybot';
    rest.getFavouriteCurrency(url, session, username, handleFavouriteCurrencyResponse)
};

exports.sendFavouriteCurrency = function postFavouriteCurrency(session, username, favouriteCurrency){
    var url = 'https://foodapp123.azurewebsites.net/tables/currencybot';
    rest.postFavouriteCurrency(url, username, favouriteCurrency);
};


exports.deleteFavouriteCurrency = function deleteFavouriteCurrency(session,username,favouriteCurrency){
    var url  = 'https://foodapp123.azurewebsites.net/tables/currencybot';


    rest.getFavouriteCurrency(url,session, username,function(message,session,username){
     var   allCurrency = JSON.parse(message);

        for(var i in allCurrency) {

            if (allCurrency[i].favouriteCurrency === favouriteCurrency && allCurrency[i].username === username) {
                console.log(allCurrency[i]);

                rest.deleteFavouriteCurrency(url,session,username,favouriteCurrency, allCurrency[i].id ,handleDeletedCurrencyResponse)

            }
        }


    });


};


function handleDeletedCurrencyResponse(body,session,username, favouriteCurrency){

        console.log('Done');


}


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
    session.send("%s, your favourite currency's are: %s", username, allCurrency);                
    
}
