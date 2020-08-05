var mysql = require("mysql");

connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "portappdb"
});

connection.connect(err => {
   if(!err) {
     console.log("Database is connected ... \n\n");   
 } else {
     console.log("Error connecting database ... \n\n");  
 }
});

module.exports = connection;