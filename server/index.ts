export {};
const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('mongoose');
const cors = require('cors');
const ProductModel = require('./src/models/productModel.ts');
const userModel = require('./src/models/userModel.ts');
const recipesRoutes = require('./src/routes/recipesRoutes.ts')();
const groceryListRoutes = require('./src/routes/groceryListRoutes.ts')(ProductModel);
const userRoutes = require('./src/routes/userRoutes.ts')(userModel);

const app = express();
app.use(cors());

const port = process.env.PORT || 2000;
const dbURL = process.env.DATABASEURL || 'mongodb://localhost/fooddb';

connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/recipes', recipesRoutes);
app.use('/list', groceryListRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server's running on port ${port}`);
});
