//SEEDING DATABASE
//common practice to isolate the database from the web application and the index.js file 
//used to just get data in the database  

////////
const mongoose = require('mongoose');

const Product = require('./models/product'); //connecting the product model 

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true }) //where to find mongo is being served & which database to use
    .then(() => {
        console.log('mongo connection open');
    })
    .catch(err => { //catches the promise error
        console.log('mongo connecction ERROR ');
        console.log(err);
    })
//////////


// const p = new Product({
//     name: 'Ruby Grapefruit',
//     price: 1.99,
//     category: 'fruit'
// })

// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e => {
//         console.log(e)
//     })

//creating an array to be added to the products collection
const seedProducts = [
    {
        name: 'Fairy Eggplant', //if this was a real app we would sluggify the names
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocalate Whole Milk',
        price: 2.69,
        category: 'dairy'
    }
]

//actually inserting the products into the collection Product 
Product.insertMany(seedProducts) //if anything does not pass validation nothing will be inserted
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })
