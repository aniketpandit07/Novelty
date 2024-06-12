const express = require("express");
const app = express();
const user = require('./routes/user');
const book = require("./routes/book");
const favourite = require("./routes/favourite")
const cart = require("./routes/cart")
const order = require ("./routes/order")


//load config from env file
require('dotenv').config();
const PORT = process.env.PORT || 3000;

//always get this file after dotenv file
require("./connections/connection")

//routes
app.use(express.json())
app.use("/api/v1",user)
app.use("/api/v1",book)
app.use("/api/v1",favourite)
app.use("/api/v1",cart)
app.use("/api/v1",user)


app.get("/", (req, res) => {
  res.send("Heloo");
});
//server
app.listen(PORT, ()=>{
    console.log(`server started successfully at port ${PORT} `)
})
