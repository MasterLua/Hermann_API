const express = require('express')
const app = express()
var mysql = require('mysql');
var bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs'),
    https = require('https')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var options = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./cert.crt'),
};

const HermannTable = {
    ["DebugIsActive"] : true,
    ["DebugPrint"] : function(msg_to_print) {
        if(HermannTable["DebugIsActive"]) {
            console.log("{Hermann-API} ", msg_to_print)
        }
    },
    ["ConFunc"] : mysql.createPool({
        host     : '51.81.42.10',
        user     : 'hermann_api',
        password : 'Izci01~81',
        database : 'Hermann_API'
      }),
      ["QueryDb"] : function(sql, cb) {
        HermannTable["ConFunc"].getConnection(function(err, connection) {
            if (err) {
                console.log(err)
                return
            }
            connection.query(sql, function(err, result) {
                connection.release();
                if (err) {
                    console.log(err)
                    return
                }
                cb(result).catch(function(error) {
                    console.error(error);
                });
            });
        });        
      },
      ["APIKeyChecking"] : function(apikey) {
        if(apikey == HermannTable["KeyAPI"]) {
            return true;
        }else{
            return false;
        }   
      },
      ["KeyAPI"] : "HermannAPI-25TYI4927POIU"
}


app.post('/login', (req, res) => {
    if(req.body && req.body.email && req.body.password && req.body.key && HermannTable["APIKeyChecking"](req.body.key)) {
        // HermannTable["DebugPrint"]("Data is receive.")
        HermannTable["QueryDb"]("SELECT * FROM `users` WHERE `email` = '"+req.body.email+"'", async function(result1){
            if(result1[0]) {
                HermannTable["DebugPrint"]("New user connected. ("+result1[0].email+")")
                res.send({ login_result: true, info: {
                    email: result1[0].email,
                    subscription : result1[0].suscription
                } })
            }else{
                // NO ACCOUNTS IS REGISTRED.
                HermannTable["DebugPrint"]("Account not registred on system. (email : "+req.body.email+")")
                res.send({login_result: false, code_error: "01", error: "This account is not registred on Website."})
            }
        })
        // HermannTable["DebugPrint"](req.body)
    }else{
        HermannTable["DebugPrint"]("Request is not valid, Invalid API, No email or no password.")
    }
})

app.post('/register', (req, res) => {
    const { email, password, name, firstname, phone, adress, cp, city, dob, key } = req.body;
    const errors = []; // Tableau pour stocker les erreurs de validation

    HermannTable["QueryDb"]("SELECT * FROM `users` WHERE `email` = '"+req.body.email+"'", async function(result0){
        if (!result0[0]) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pour vérifier le format de l'email
            if (!email || !emailRegex.test(email)) {
                errors.push({ field: 'email', message: 'Email invalide.' });
            }
        
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Conditions pour le mot de passe
            if (!password || !passwordRegex.test(password)) {
                errors.push({ field: 'password', message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.' });
            }
        
            if (!name || name.length < 2) {
                errors.push({ field: 'name', message: 'Le nom doit contenir au moins 2 caractères.' });
            }
            if (!firstname || firstname.length < 2) {
                errors.push({ field: 'firstname', message: 'Le prénom doit contenir au moins 2 caractères.' });
            }
        
            if (!key || !HermannTable["APIKeyChecking"](key)) {
                errors.push({ field: 'apiKey', message: 'Clé API invalide.' });
            }
        
            if (errors.length > 0) {
                return res.send({ register_result: false, errors });
            }else{
                HermannTable["QueryDb"]("INSERT INTO `users`(`email`, `password`, `name`, `firstname`, `phone`, `adress`, `cp`, `city`, `dob`) VALUES ('"+req.body.email+"','"+req.body.password+"','"+req.body.name+"','"+req.body.firstname+"','"+req.body.phone+"','"+req.body.adress+"','"+req.body.cp+"','"+req.body.city+"','"+req.body.dob+"')", async function(result1){                    res.send({ register_result: true });
                    HermannTable["DebugPrint"]("Compte créé avec succès.");
                });
            }
        } else {
            errors.push({ field: 'email', message: 'Email déjà enregistré.' });
            HermannTable["DebugPrint"]("Email déjà enregistré : " + email);
            return res.send({ register_result: false, errors });
        }
    });
});

app.post('/buy', (req, res) => {
    if(req.body && req.body.email && req.body.key && req.body.product_name && HermannTable["APIKeyChecking"](req.body.key)) {
        HermannTable["QueryDb"]("SELECT * FROM `users` WHERE `email` = '"+req.body.email+"'", async function(result0){
            if(result0[0]) {
                HermannTable["QueryDb"]("SELECT * FROM `products` WHERE `product_name` = '"+req.body.product_name+"'", async function(result3){
                    if(result3[0]) {
                        var Sub = JSON.parse(result0[0].suscription)
                        var CanBuy = true
                        for (var i = 0; i < Object.keys(Sub).length; i++){
                            if(Sub[i] && Sub[i].product_name == req.body.product_name && Sub[i].active) {
                                CanBuy = false
                            }
                        }
        
                        if(CanBuy) {
                            Sub[(Object.keys(Sub).length + 1)] = {
                                product_name: req.body.product_name,
                                active: true,
                                time_left: 30
                            }
                            
                            HermannTable["QueryDb"]("UPDATE `users` SET `suscription`='"+JSON.stringify(Sub)+"' WHERE `email` = '"+req.body.email+"'", async function(result1){})
                            HermannTable["QueryDb"]("INSERT INTO `payements_history`(`email`, `product_name`, `date`, `hours`) VALUES ('"+req.body.email+"','"+req.body.product_name+"', CURDATE(), CURRENT_TIME())", async function(result2){})        
                            HermannTable["DebugPrint"]("Subscription has been buyed. ("+req.body.product_name+", "+req.body.email+")")
                            res.send({ buy_result: true })
                        }else{
                            HermannTable["DebugPrint"]("Subscription has already buyed. ("+req.body.product_name+", "+req.body.email+")")
                            res.send({ buy_result: false, code_error: "04", error: "Subscription has already buyed." })
                        }        
                    }else{
                        HermannTable["DebugPrint"]("Product name don't exist. ("+req.body.product_name+", "+req.body.email+")")
                        res.send({ buy_result: false, code_error: "05", error: "Product name don't exist." })
                    }
                })
            }else{
                HermannTable["DebugPrint"]("Account not registred on system. (email : "+req.body.email+")")
                res.send({ buy_result: false, code_error: "01", error: "This account is not registred on Website." })
            }
        })
    }else{
        HermannTable["DebugPrint"]("Request is not valid, Invalid API, No need informations for Register.")
        res.send({ buy_result: false, code_error: "02", error : "Invalid API, No need informations for Register." })
    }
})

app.post('/sub_list', (req, res) => {
    if(req.body && req.body.email && req.body.key && HermannTable["APIKeyChecking"](req.body.key)) {
        HermannTable["QueryDb"]("SELECT * FROM `users` WHERE `email` = '"+req.body.email+"'", async function(result0){
            if(result0[0]) {
                HermannTable["QueryDb"]("SELECT * FROM `products`", async function(result1){
                    var All_Sub = {}
                    var Sub = JSON.parse(result0[0].suscription)

                    var All_Products = {}
                    console.log(result1)
                    for (var i = 0; i < result1.length; i++){
                        All_Products[result1[i].product_name] = {
                            product_name: result1[i].product_name,
                            product_label: result1[i].product_label,
                            price: result1[i].price,
                            subscription: result1[i].subscription,
                        }
                    }    

                    console.log(All_Products)
                    console.log(Sub)
                    
                    for (var i = 1; i <= Object.keys(Sub).length; i++){
                        console.log("Working")
                        console.log(All_Products[Sub[i.toString()].product_name])
                        console.log(All_Products[Sub[i.toString()].product_name].product_label)
                        All_Sub[i] = {
                            product_name: All_Products[Sub[i.toString()].product_name].product_name,
                            product_label: All_Products[Sub[i.toString()].product_name].product_label,
                            price: All_Products[Sub[i.toString()].product_name].price,
                            subscription: All_Products[Sub[i.toString()].product_name].subscription,
                            active: Sub[i.toString()].active,
                            time_left : Sub[i.toString()].time_left
                        }
                    }
                    
                    res.send(JSON.stringify(All_Sub))
                    HermannTable["DebugPrint"]("Get list of subscribe. (email : "+req.body.email+")")
                })                    
            }else{
                HermannTable["DebugPrint"]("Account not registred on system. (email : "+req.body.email+")")
                res.send({ buy_result: false, code_error: "01", error: "This account is not registred on Website." })
            }
        })
    }
})


app.post('/get_product', (req, res) => {
    if(req.body && req.body.key && HermannTable["APIKeyChecking"](req.body.key)) {
        HermannTable["DebugPrint"]("Request list of product.")

        HermannTable["QueryDb"]("SELECT * FROM `products`", async function(result1){
            if(result1[0]) {
                var All_Products = {}
                for (var i = 0; i < result1.length; i++){
                    All_Products[result1[i].product_name] = {
                        product_name: result1[i].product_name,
                        product_label: result1[i].product_label,
                        product_description: result1[i].product_description,
                        price: result1[i].price,
                        subscription: result1[i].subscription,
                        image: result1[i].image,
                    }
                }
            }
            HermannTable["DebugPrint"]("Request list of product.")
            res.send(JSON.stringify(All_Products))
        })
    }
})

https.createServer(options, app).listen(3050, function(){
    console.log("{Hermann-API} Started.")
});


// 01 = Account not registred.
// 02 = Invalid API
// 03 = Already Registered email
// 04 = Subscribe already buyed
// 05 = Product not exist
