const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  // Register the user
  users.push({ username, password });

  // Return success response
  return res.status(200).json({ message: 'User registered successfully.' });
  

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    if (books.length!== 0) {
        return res.send(JSON.stringify({books},null, 4));
    }else{
        return res.status(404).json({message: "Books not found!"});
    }

});

//Get all books using Async callbacks
public_users.get("/server/asynbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5000/");
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let targetISBN = req.params.isbn;
  let filteredBook = Object.values(books).filter(book => book.isbn === targetISBN);
  if (filteredBook.length !== 0) {
      return res.send(JSON.stringify({filteredBook}, null, 4));
  }
  return res.status(404).json({message: "Book not found!"});
 });
  
  //Get book details by ISBN using Promises
  public_users.get("/server/asynbooks/isbn/:isbn", function (req,res) {
    let {isbn} = req.params;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(function(response){
      console.log(response.data);
      return res.status(200).json(response.data);
    })
    .catch(function(error){
        console.log(error);
        return res.status(500).json({message: "Error while fetching book details."})
    })
  });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let targetAuthor = req.params.author;
  let filteredBook = Object.values(books).filter(book => book.author === targetAuthor);
  if (filteredBook) {
      return res.send(JSON.stringify({filteredBook}, null, 4));
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let targetTitle = req.params.title;
  let filteredBook = Object.values(books).filter(book => book.title === targetTitle);
  if (filteredBook) {
      return res.send(JSON.stringify({filteredBook}, null, 4));
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

//Get book details by author using promises
public_users.get("/server/asynbooks/author/:author", function (req,res) {
  let {author} = req.params;
  axios.get(`http://localhost:5000/author/${author}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let targetISBN = req.params.isbn;
  let filteredBook = Object.values(books).filter(book => book.isbn === targetISBN);
  if (filteredBook.length !== 0) {
      
      return res.send(JSON.stringify(filteredBook.map(book => book.reviews), null, 4));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
