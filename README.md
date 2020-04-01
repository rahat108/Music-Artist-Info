# deltax_assignment

This assignment problem consists of a music web app where top artists and top songs are shown based on their best avg rating. This assignment was given by the deltax company as a part of a hiring process, it is one of the rounds to go through.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Dependencies and environment needed
bodyparser
ejs
express
express-session
express-validator
fs
mongoose
nodemon
path-tp-regexp
nodejs

### Installing

All the dependencies can be installed after nodejs cmd has been setup using
npm i <dependency>
eg:
  npm i ejs
  

## Running the project

To run the program enter the command
npm run server
go to the browser and enter the url
http://localhost:3000/
certain users and inserted into the database as registration is not created so login directly using the pre inserted users in the users table in database with command.
http://localhost:3000/<username>
eg:
  http://localhost:3000/rahat  (post command activates a session)

### Break down into end to end tests

home page gives the required data if new song is to be added it goes to other page where an option to add a song is given and also a option to add a artist is provided which is handled by a modal.

### Built With

Backend: (javascript)
nodejs,expressjs
Frontend:
html,css,bootstrap and embedded javascript templating is used to display the data retrieved from the server side to client side. The frontend pages are rendered which are stored in the views folder.
