const express = require('express')
const app = express()
var mysql = require('mysql');
var bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');
const { register } = require('module');
app.use(bodyParser.json());

const HermannTable = {
    ["DebugIsActive"] : true,
    ["DebugPrint"] : function(msg_to_print) {
        if(HermannTable["DebugIsActive"]) {
            console.log("{Hermann-API} ", msg_to_print)
        }
    },
    ["ConFunc"] : mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'HermannDB'
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
    if(req.body && req.body.email && req.body.password && req.body.name && req.body.firstname && req.body.phone && req.body.adress && req.body.cp && req.body.city && req.body.dob && req.body.key && HermannTable["APIKeyChecking"](req.body.key)) {
        HermannTable["QueryDb"]("SELECT * FROM `users` WHERE `email` = '"+req.body.email+"'", async function(result0){
            if(!result0[0]) {
                HermannTable["QueryDb"]("INSERT INTO `users`(`email`, `password`, `name`, `firstname`, `phone`, `adress`, `cp`, `city`, `dob`) VALUES ('"+req.body.email+"','"+req.body.password+"','"+req.body.name+"','"+req.body.firstname+"','"+req.body.phone+"','"+req.body.adress+"','"+req.body.cp+"','"+req.body.city+"','"+req.body.dob+"')", async function(result1){})
                res.send({ register_result: true })
                HermannTable["DebugPrint"]("Account is created. ('"+req.body.email+"','"+req.body.password+"','"+req.body.name+"','"+req.body.firstname+"','"+req.body.phone+"','"+req.body.adress+"','"+req.body.cp+"','"+req.body.city+"','"+req.body.dob+"')")
            }else{
                res.send({ register_result: false, code_error: "03", error: "Already account register with this Email." })
                HermannTable["DebugPrint"]("Already account register with this Email. ("+req.body.email+")")
            }
        })
    }else{
        HermannTable["DebugPrint"]("Request is not valid, Invalid API, No need informations for Register.")
        res.send({ register_result: false, code_error: "02", error : "Invalid API, No need informations for Register." })
    }
})

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

                    for (var i = 0; i < Object.keys(Sub).length; i++){
                        console.log("Working")
                        console.log(All_Products[Sub[i].product_name].product_name)
                        // All_Sub[i] = {
                        //     product_name: All_Products[Sub[i].product_name],
                        //     product_label: result1[i].product_label,
                        //     price: result1[i].price,
                        //     subscription: result1[i].subscription,

                        // }
                        // All_Sub[i] = All_Products[Sub[i].product_name]
                    }
                    
                    console.log(All_Sub)

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

app.listen(3050, () => {
  console.log("{Hermann-API} Started.")
})

// 01 = Account not registred.
// 02 = Invalid API
// 03 = Already Registered email
// 04 = Subscribe already buyed
// 05 = Product not exist
