Tutorial Used: https://www.youtube.com/watch?v=l8WPWK9mS5M

## What does CRUD mean? 
It is an acryonym that stands for create, read, update, and delete. Most modern applications are CRUD is some form or another. 

## Initializing a Node Project
You will create a folder with the project that you will contain in, then within the terminal type the following command: 
```
$ npm init -y
```

This will create an empty package.json with nothing in it. This file is essentially a JSON file that contains relevant information for the project that you are working on. 

### Downloading Dependencies 
To download any dependencies in node, you will type in the following command: 
```
$ npm install --save express
```

### Creating Index.js and Imports
After downloading the dependencies, create a file with the name "index.js", which is essentially the "main.cpp" of the application. After doing so, import the required libraries through the following syntax: 
```javascript
const express = require('express')
const bodyParser = require('body-parser') // This lets the code know that we are working with JSON as data
```

### Configuring the Express App 
In order to create the express application (which will run on the web), we do this by creating an "app" object. 
```javascript
const app = express(); // creating the express application
const PORT = 5000; // this is the port that the application will run on 


app.use(bodyParser.json()); // this is letting the application know that we will be dealing with JSON data

// this is trying to bind and listen to the connection that was on the specified host and port
// ie, it is trying to establish a connection on the specified port.
app.listen(PORT, () => {console.log(`Server on port http://localhost:${PORT}`)});
```

### Nodemon for Testing
One thing that you will notice is that in order to debug, since you are handling something that is event driven, after the program is run, it will terminate. For the sake of development, we will install the following: `npm install --save-dev nodemon`. 

After doing this, go within package.JSON file and then create a start script. 
```json
"scripts": {

    "start": "nodemon index.js"

}
```
Then after you run `npm start`, it will automatically update the server and code changes everytime you save.

## Routes
In order for the program to work correctly, we need to establish routes. When it comes to the HTTP protocol, the methods POST, GET, DELETE, and UPDATE are the most fundamental HTTP methods in order to send/retrieve data from a server. 

Within the example that is coming up, let's say we have an API containing a bunch of users. 

Watch the following tutorial really quickly: https://www.youtube.com/watch?v=H1BebGmRjzE&list=PLKhlp2qtUcSYC7EffnHzD-Ws2xG-j3aYo&index=



