const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// Handling uncaught exceptions...
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(
    `Shutting down the server due to uncaught exception: ${err.stack}`
  );

  process.exit(1);
});

// Dotenv...
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Cookie parser...
const cookie = require("cookie-parser");
app.use(cookie());

app.use(express.json());


app.get("/",(req,res)=>{
  res.send("Hello World!");
})

// Connecting Database...
const connectDB = require("./database/dbConnect");
connectDB();

// Route configurations...
const questionsRoute = require("./routes/questionRoute");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use("/api/v1", questionsRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1/admin", adminRoute);

const cseId = process.env.CSE_ID;
const apiKey = process.env.API_KEY;
app.get('/api/v2/search', async(req,res)=>{
    const {query} = req.query;

    const url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cseId + '&q=' + encodeURIComponent(query);

    try{
        const response = await fetch(url);
        const json = await response.json();
        const data = json.items;
        return res.status(200).json({success:true, data});
    } catch(err){
        return res.status(500).json({success:false, message:"Internal Server Error ..."});
    }
})

//  Error Handler...
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

// Unhandled promise rejection...
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(
    `Shutting down the server due to unhandle promise: ${err.message}`
    );
    server.close(() => {
      process.exit(1);
    });
  });
  
  
  // Server running...
  const server = app.listen(process.env.PORT, () => {
    console.log(`server run at http://${process.env.HOST}:${process.env.PORT}`);
  });



  