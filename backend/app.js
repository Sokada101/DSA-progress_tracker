const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const problemsRoutes = require('./routes/problem');
const userRoutes = require('./routes/user');

const app = express();

mongoose
  .connect(
    "mongodb+srv://dev:"+ process.env.MONGO_ATLAS_PW + "@cluster0.m92hu.mongodb.net/node-angular?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("not connected to db");
  });

app.use(bodyParser.json());
app.use("/",express.static(path.join( __dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/problems",problemsRoutes);
app.use("/api/user", userRoutes);
app.use((req,res,next) => {
  res.sendFile(__dirname, path.join("angular", "index.html"));
});



module.exports = app;