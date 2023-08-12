const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function addOrUpdateReview(isbn, username, review) {
  for (const id in books) {
      if (books.hasOwnProperty(id) && books[id].isbn === isbn) {
          const book = books[id];
          const existingReview = book.reviews.find(r => r.username === username);
          
          if (existingReview) {
              existingReview.review = review;
              return "Review updated"; // Review was updated
          } else {
              book.reviews.push({ username, review });
              return "Review added"; // Review was added
          }
      }
  }
  
  return "Book not found";
}

function deleteReviewByOwner(isbn, username) {
  for (const id in books) {
      if (books.hasOwnProperty(id) && books[id].isbn === isbn) {
          const book = books[id];
          const reviewIndex = book.reviews.findIndex(r => r.username === username);
          
          if (reviewIndex !== -1) {
              book.reviews.splice(reviewIndex, 1);
              return "Review deleted"; // Review was deleted
          } else {
              return "Review not found"; // Review by user not found
          }
      }
  }
  
  return "Book not found";
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  
  // check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Please provide both username and password."});
  }

  // check if user is registered
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({message: "Invalid credentials."});
  }

  // check if password is correct
  if (user.password !== password) {
    return res.status(401).json({message: "Invalid credentials."});
  }

  // generate JWT token
  const accessToken = jwt.sign({ username: user.username }, 'your_secret_key');

  // save token in session
  req.session.accessToken = accessToken;

  // return success message with access token
  return res.json({message: "Login successful.", accessToken});
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  console.log(username);
 const matchingBook = Object.values(books).filter(book => book.isbn === isbn);
  if (!review) {
    return res.status(400).json({message: "Please provide a review"});
  }
  if (matchingBook.length < 0) {
    return res.status(404).json({message: "Book not found"});
  }
  const result = addOrUpdateReview(matchingBook[0].isbn, username, review);
  if (result === "Review added") {
    return res.json({message: "Review added successfully"});
    
  } else if(result === "Review updated"){
    return res.json({message: "Review modified successfully"});
  }

  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const username = req.session.username;
  const isbn = req.params.isbn;

  const deleteResult = deleteReviewByOwner(isbn, username);
  if (deleteResult === "Review deleted") {
    return res.json({message: "Review deleted successfully"});
  } else if(deleteResult === "Review not found"){
    return res.json({message: "Review not found"});
  }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
