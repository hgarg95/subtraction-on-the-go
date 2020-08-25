const express = require('express');

const app = express();

const routes = require('./app/routes/routes.js');

app.get("/", (req,res) => {
    res.send("Welcome");
}
);

routes(app);

app.listen((process.env.PORT || 3000)
, () => {
    console.log("Listening on port 3000");
})