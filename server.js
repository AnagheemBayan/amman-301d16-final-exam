'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request

// Specify a directory for static resources
app.use(express.static('/public'))
app.use(express.urlencoded({extended:true}))

// define our method-override reference
app.use(methodOverride,'_method');

// Set the view engine for server-side templating
app.set('view engine','ejs');

// Use app cors
app.use(cors());

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get(`/`, getQuto)
app.get('/favorite-quotes/:id',selectFav)
app.post('/favorite-quotes/:id',handleFav)
app.update('/favorite-quotes/:id',updateFav)
app.delete('/favorite-quotes/:id',deleteFav)

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function getQuto(req,res){
    const count =10;
    const url=`https://thesimpsonsquoteapi.glitch.me/quotes${count}`
    superagent.get(url).then((result) =>[
        res.render('home',{data:result.body})
    ]).catch((error) =>{
        console.log('no character found')
    })
}

function selectFav(req,res){
    const id = [req.params.id]
    const SQL ='SELECT * FROM characters'
    client.query(SQL,id).then((result)=>{
        res.render('favorite-quotes',{{data:result.rows})
    })
}

function handleFav(req,res){
    const{quote, character , image , characterDirection } =req.body
    const sql = 'INSERT INTO characters (quote, character , image , characterDirection ) VALUES ($1,$2,$3,$4)'
    const value=[quote, character , image , characterDirection ]

    client.query(sql,value).then((data)=>{
        res.render('favorite-quotes',{result:data.rows})
    }).catch((error) =>{
        console.log('no character found')
    })
}

function updateFav(req,res){
    const{quote, character , image , characterDirection } =req.body
    const sql = 'UPDATE   characters SET quote=$1, character=$2 , image=$3 , characterDirection=$4 ';
    const value=[quote, character , image , characterDirection ]
    client.query(sql,value).then(result=>{
        res.redirect(`/details`)
    }).catch((error) =>{
        console.log('no character found')
    })

}
 
function deleteFav(req,res){
    const id = [req.body.id]
    const sql = 'DELETE FROM characters WHERE id=$1 ';
    client.query(sql,id).then(result=>{
        res.redirect(`/details `)
    }).catch((error) =>{
        console.log('no character found')
    })

}





function character(data){
  this.quote=data.quote ; 
  this.character=data.character; 
  this.image = data.image;
  this.characterDirection=data.characterDirection;

}
// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
