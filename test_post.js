var request = require('request');

// Register

function Register() {
    request({
        url: "http://127.0.0.1:3050/register",
        method: "POST",
        json: true,   // <--Very important!!!
        body: {
            key: "HermannAPI-25TYI4927POIU",
            email: "test@test.fr",
            password: "PasswordSecure@1",
            name: "Joran",
            firstname: "Deroulo",
            phone: "060444444",
            adress: "3 rue du pré",
            cp: "75018",
            city: "Paris",
            dob: "08/08/1999"
    
        }
    }, function (error, response, body){
        console.log(response);
    });    
}


function login() {
    request({
        url: "http://127.0.0.1:3050/buy",
        method: "POST",
        json: true,   // <--Very important!!!
        body: {
            key: "HermannAPI-25TYI4927POIU",
            email: "test@test.fr",
            password: "PasswordSecure@1"
        }
    }, function (error, response, body){
        console.log(response);
    });    
}

function Buy() {
    request({
        url: "http://127.0.0.1:3050/buy",
        method: "POST",
        json: true,   // <--Very important!!!
        body: {
            key: "HermannAPI-25TYI4927POIU",
            email: "test@test.fr",
            product_name: "hermann_1_month"
        }
    }, function (error, response, body){
        console.log(response);
    });    
}

Buy();