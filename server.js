const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const path = require("path")
const userRoute = require("./routes/userRoute")
const mongo = require("./modules/mongo")

app.listen(3030);
app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname, "public"))) // static degani shu papkani ichidagi fayllarga kirish huquqini beradi
app.use("/bootstrap", express.static(path.join(__dirname,"node_modules","bootstrap","dist")));
app.use("/bootstrap", express.static(path.join(__dirname,"node_modules","bootstrap","js")));

(async function(){
    let db  =await mongo();
    await app.use((req,res,next)=>{
        req.db = db;
        next();
    });
    await app.use(userRoute.path, userRoute.router)
})();

// app.get("/delete/:id", (req,res) =>{
//     let index =data.findIndex((e) =>( e.id == req.params.id))
//     data.splice(index,1)
//     res.redirect("/main")
// })


  
app.set("view engine", "ejs")

