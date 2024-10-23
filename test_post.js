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
        console.log(body);
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
        console.log(body);
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
        console.log(body);
    });    
}

function RetreiveSub() {
    request({
        url: "http://127.0.0.1:3050/sub_list",
        method: "POST",
        json: true,   // <--Very important!!!
        body: {
            key: "HermannAPI-25TYI4927POIU",
            email: "test@test.fr"
        }
    }, function (error, response, body){
        console.log(body);
    });
}

function RetriveList() {
    request({
        url: "http://127.0.0.1:3050/get_product",
        method: "POST",
        json: true,   // <--Very important!!!
        body: {
            key: "HermannAPI-25TYI4927POIU"
        }
    }, function (error, response, body){
        console.log(body);
    });
}

RetriveList();
// Buy();
