var rest = require('../API/Restclient');
var builder = require('botbuilder');

//Calls getCurrencyCards
exports.displayCurrencyCards = function getCurrencyData(session){
    var url = "https://globalcurrencies.xignite.com/xGlobalCurrencies.json/ListActiveCurrencies?&_token=9914C05A47E044D0BD022D6BA82318FA";

    rest.getCurrencyData(url, session, displayCurrencyCards);
}

function displayCurrencyCards(message, session){
    //Parses JSON
    var rateItems= []
    var currencyRate = JSON.parse(message);
    
    for (var index in currencyRate.CurrencyList) {
        var rate = currencyRate.CurrencyList[index];
        var symbol_stuff = rate.Symbol;
        //var name = rate.name;
    	
    	rateItems = rateItems + symbol_stuff;

    	
    	//console.log(userMessage);
	}

	    session.send(new builder.Message(session).addAttachment({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "0.5",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "lok",
                            "size": "large"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Nutritional Information"
                        }
                    ]
                },
                {
                    "type": "Container",
                    "spacing": "none",
                    "items": [
                        {
                            "type": "ColumnSet",
                            "columns": [
                                {
                                    "type": "Column",
                                    "width": "auto",
                                    "items": [
                                        {
                                            "type": "FactSet",
                                            "facts": "nutritionItems"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }));	
}