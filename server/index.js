const express = require("express");
// const cors = require("cors");

require('dotenv').config();
const PORT = process.env.PORT || 4000;

// // let's tackel cors 
const cors = require('cors');

const app = express();

// Allow requests from the frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000',  // Or use '*' to allow all origins, but this is not recommended for production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  // If you need to allow cookies or authentication headers
}));

// app.use(cors(corsOptions));


// Middleware for parsing cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware for parsing JSON
app.use(express.json());

// Database connection
require("./config/database").connect();

// CORS setup
// const cors = require("cors");

// const allowedOrigins = [
//     "http://192.168.8.112:3000",

// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ['GET', 'POST'], // Allow methods
//     credentials: true, // Allow credentials (cookies, etc.)
// };

// app.use(cors(corsOptions));

// Route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

// Start the server
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});
