
var builder = require('botbuilder');
//var restaurant = require('./RestaurantCard');
var currencyrates = require('./CurrencyCard');
var currency = require('./FavouriteCurrency');
var customVision = require('./CustomVision');
//var qna = require('./QnAMaker');



exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1c74f39f-f14c-4eaf-bc82-2c0ac8acc789?subscription-key=1aa6de79863c49c9a65cda005c9a5aff&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

//     bot.dialog('WantFood', function (session, args) {
//         if (!isAttachment(session)) {
//             // Pulls out the food entity from the session if it exists
//             var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

//             // Checks if the food entity was found
//             if (foodEntity) {
//                 session.send('Looking for restaurants which sell %s...', foodEntity.entity);
//                 restaurant.displayRestaurantCards(foodEntity.entity, "auckland", session);
//             } else {
//                 session.send("No food identified! Please try again");
//             }
//         }
// //this is a change
//     }).triggerAction({
//         matches: 'WantFood'
//     });
//     bot.dialog('QnA', [
//     function (session, args, next) {
//         session.dialogData.args = args || {};
//         builder.Prompts.text(session, "What is your question?");
//     },
//     function (session, results, next) {
//         qna.talkToQnA(session, results.response);
//     }
//     ]).triggerAction({
//         matches: 'QnA'
//     });

    bot.dialog('DeleteCurrency', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
        if (!isAttachment(session)) {

            session.send("You want to delete one of your favourite currency's.");

            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Deleting \'%s\'...', currencyEntity.entity);
                currency.deleteFavouriteCurrency(session,session.conversationData['username'],currencyEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No currency identified! Please try again");
            }
        }

    }
    ]).triggerAction({
        matches: 'DeleteCurrency'

    });

    bot.dialog('GetCurrency', function (session, args) {
        if (!isAttachment(session)) {

            // Pulls out the food entity from the session if it exists
            var currencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'currency');

            // Checks if the for entity was found
            if (currencyEntity) {
                session.send('Getting currency in %s...', currencyEntity.entity);
                currencyrates.displayCurrencyCards(currencyEntity.entity, session);

            } else {
                session.send("No currency identified! Please try again");
            }
        }
    }).triggerAction({
        matches: 'GetCurrency'
    });

   bot.dialog('GetFavouriteCurrency', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your favourite currency");
                currency.displayFavouriteCurrency(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            }
        }
    ]).triggerAction({
        matches: 'GetFavouriteCurrency'
    });

    bot.dialog('LookForFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');
    
                // Checks if the food entity was found
                if (currencyEntity) {
                    session.send('Thanks for telling me that \'%s\' is your favourite currency', currencyEntity.entity);
                    currency.sendFavouriteCurrency(session, session.conversationData["username"], currencyEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No currency identified!!!");
                }
            }
        }
    ]).triggerAction({
        matches: 'LookForFavourite'
    });
    

    // bot.dialog('WelcomeIntent', function (session, args) {
    //     console.log("Hit");
    //     session.send("Welcome to the FoodBot");
    
    // }).triggerAction({
    //     matches: 'WelcomeIntent'
    // });


}

// Function is called when the user inputs an attachment
function isAttachment(session) { 
    var msg = session.message.text;
    if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
        
        //call custom vision here later
        customVision.retreiveMessage(session);
        
        
        return true;
    }
    else {
        return false;
    }
}
