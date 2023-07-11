//SETTING UP THE APPLICATION
//when starting take the basic code required and put it in here
//but eventually this file will be pretty small becasues all the routes will be taken out
const express = require('express');
const app = express(); //setting app to the result of executing express 
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const Product = require('./models/product'); //connecting the product model 

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true }) //where to find mongo is being served & which database to use
    .then(() => {
        console.log('mongo connection open');
    })
    .catch(err => { //catches the promise error
        console.log('mongo connecction ERROR ');
        console.log(err);
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); //sets the templating engine to ejs 

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')); //tells app to use method override

const categories = ['fruit', 'vegetable', 'dairy']

//INDEX OF PRODUCTS 
//CREATING A ROUTE TO TEH MONGO DATABASE 
//query to the databsae  
app.get('/products', async (req, res) => { //async handler 
    const { category } = req.query;
    if (category) { //if we find a category in the request query 
        const products = await Product.find({ category }) //then products will be found based upon that category
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({}) //otherwise we are going to find all products ({})
        res.render('products/index', { products, category: 'All' }) //renders the page index.ejs and passes thorugh the products 

    }
    //async logic of waiting for it to come back before next operation is standard essential practice
})

//NEW PRODUCT FORM 
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories }) //passing through categories 
})

//POSTING THE NEW PRODUCT FORM 
app.post('/products', async (req, res) => {
    //when we write a post request and want to get the request from the body so we need to tell express to use the middlewear (app.use(express.urlencoded({ extended: true }))) 
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

//ROUTE TO INDIVIDUAL PRODUCT
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show', { product }) //renders show with the individual product to that template 
})

//SERVING THE EDIT FORM 
app.get('/products/:id/edit', async (req, res) => { //need the ID to know what we
    const { id } = req.params; //destructuring to get the id from the request parameters 
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

//REPLACING THE PRODUCT DETAILS WITH DATA FROM THE EDIT FORM
app.put('/products/:id', async (req, res) => {
    const { id } = req.params; //destructuring to get the id from the request parameters 
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true }) //pass in id, and the data we want to update with 
    //alternative is findbyid() and call .save() which will automatically run the validators  
    res.redirect(`/products/${product._id}`); //so you dont send the form over and over again 
}) //using PUT because replacing all the data in the model. If it was just replacing one part then would be a patch request e.g a route just changing the price 

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log('App listening on port 3000 ')
})

//IMPLEMENTING NEW PRODUCTS : FOLLOWING EXACT SAME PATTERN





//GENERAL NOTES:
//Isolate models because would be clunky to have them all in index.js
//generally query strings are used for filtering or searching 