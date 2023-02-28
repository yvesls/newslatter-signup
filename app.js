//jshint esversion: 6
// mailchimp-key ----> ca7506e19f66875cb8bcb1f45906f3c5-us21
// list id -----> 741ec40c1b
const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");
const port = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // permite que o express carregue a pasta passada de arquivos estáticos

app.listen(port || 3000, () =>{
    console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    NOME: nome,
                    SOBRENOME: sobrenome
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/741ec40c1b";
    const options = {
        method: "POST",
        auth: "yvesls:ca7506e19f66875cb8bcb1f45906f3c5-us21"
    };
    const request = https.request(url, options, (response)=>{
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
        if(response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        }else {
            res.sendFile(__dirname+"/failure.html");
        }
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
})