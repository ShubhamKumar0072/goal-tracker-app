const express = require("express");
const  app = express();
const cors = require("cors");
const corsOption = {
    origin:["http://localhost:5173"]
}

app.use(cors(corsOption));

app.get("/api",(req,res)=>{
    res.json({fruits:["a","b","c"]})
});

app.listen(3000,()=>{
    console.log("server started on port 3000");
})