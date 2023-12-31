const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv").config();
const db = require("./config/dbConfig.js");
const serverRoutes = require("./routes/serverRoutes.js");

const app = express()
const port = process.env.PORT || 5001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

app.use("/", serverRoutes);
app.use('/public', express.static('uploads/'));    // http://localhost:5000/public/download.jpg   // http://localhost:5000/public/563c1b31-2377-47fd-abcd-b6810c25943a.jpg



db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + db.threadId);
});

db.on('error', err => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error("Connection to database lost. Reconnecting...");
        db.connect();
    } else {
        console.error("Database error:", err.message);
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

