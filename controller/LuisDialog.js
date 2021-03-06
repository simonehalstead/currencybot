
var builder = require('botbuilder');

var currencyrates = require('./CurrencyCard');
var currency = require('./FavouriteCurrency');
var customVision = require('./CustomVision');




exports.startDialog = function (bot) {

    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1c74f39f-f14c-4eaf-bc82-2c0ac8acc789?subscription-key=1aa6de79863c49c9a65cda005c9a5aff&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);


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

            // Pulls out the currency entity from the session if it exists
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

            // Pulls out the currency entity from the session if it exists
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
                currency.displayFavouriteCurrency(session, session.conversationData["username"]);  // <---- important, checks if going to and displaying currency
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
                // Pulls out the currency entity from the session if it exists
                var currencyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'currency');
    
                // Checks if the currency entity was found
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
    

    bot.dialog('WelcomeIntent', [
        function (session, next) {
            session.send("Hey there");
            if(!session.conversationData["username"]){
                builder.Prompts.text(session, "Please enter your name");
            } else {
                next();
            }
    },
        function (session, results, next){
            if (results.response) {
                session.conversationData["username"] = results.response;
                session.send(`Hey, ${results.response}`);
            }
        

    }

    ]).triggerAction({
        matches: 'WelcomeIntent'
    });


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
