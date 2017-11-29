var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/5fc2920e-2f9e-418f-b27d-f2bf3a1ab24c/url?iterationId=546d77eb-f6e0-46ad-9a1f-63085739aed1',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '4609999dc6134d9d8faa66f6d90b66ce'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}