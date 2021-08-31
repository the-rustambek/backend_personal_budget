const router = require("express").Router();
const {
    createCrypt
} = require("../modules/bcrypt")
const mongo = require("../modules/mongo")
const {
    createToken
} = require("../modules/jwt")
const {
    compareCrypt
} = require("../modules/bcrypt")
const {
    checkToken
} = require("../modules/jwt");
const {
    ObjectId
} = require("mongodb");

router.get("/", (req, res) => {
    // console.log(req.db)s
    res.render("index")
})

router.get("/signup", (req, res) => {
    res.render("sign")
})

router.post("/signup", async (req, res) => {
    // console.log(req.body)
    const {email,password} = req.body;
    if (!(email && password)) {
        res.render("index", {
            error: "Email or Password not found"
        })
        return;
    }

    let user = await req.db.users.findOne({
        email: email.toLowerCase(),
    })
    // console.log(user)

    if (user) {
        res.render("index", {
            error: "Email already exists",
        })
        return;
    }

    user = await req.db.users.insertOne({
        email: email.toLowerCase(),
        password: await createCrypt(password),
        data: [],
        expenseData: [],
    });

    res.redirect("/")
})



router.post("/", async (req, res) => {
    const {  email, password} = req.body;
    if (!(email && password)) {
        res.render("index", {
            error: "Email or Password not found",
        });
        return;
    }
    user = await req.db.users.findOne({
        email: email.toLowerCase(),
    })
    // console.log(user)
    if (!user) {
        res.render("index", {
            error: "User not found",
        })
        return;
    }
    // console.log(user)
    if (!(await compareCrypt(user.password, password))) {
        res.render("index", {
            error: "Password is incorrect"
        });
        return;
    }
    const token = createToken({
        user_id: user._id
    })
    res.cookie("token", token).redirect("/main")
})
async function AuthUserMiddleware(req, res, next) {
    if (!req.cookies.token) {
        res.redirect("/")
    }
    const isTrust = checkToken(req.cookies.token)
    if (isTrust) {
        req.user = isTrust;
        next();
    } else {
        res.redirect("/")
    }
}



router.post("/main", AuthUserMiddleware, async (req, res) => {
    const {user_id } = req.user
    const {  name, price, time} = req.body;
     
  
    await req.db.users.updateOne({
        _id: ObjectId(user_id)
    }, {
        $push: {
            data: {
                $each: [{
                    name: req.body.name.toLowerCase(),
                    price: req.body.price,
                    time: new Date().toLocaleString()
                }],
            }
        } 
    })
     await 



    res.redirect("/main")
});




router.post("/outcome", AuthUserMiddleware, async (req, res) => {
    const {user_id } = req.user
    const { time,expenseName,expensePrice} = req.body;
   
    
    await req.db.users.updateOne({
        _id: ObjectId(user_id)
    }, {
        $push: {
            expenseData: {
                $each: [{
                    expenseName: req.body.expenseName.toLowerCase(),
                    expensePrice: req.body.expensePrice,
                    time: new Date().toLocaleString()
                }],
            }
        } 
    })
    res.redirect("/main")
});







router.get("/main", AuthUserMiddleware, async (req, res) => {
    const {user_id } = req.user

    let info = await req.db.users.findOne({
        _id: ObjectId(user_id)
    })  

    let data = info.data;
    let expenseData = info.expenseData;
    
    
    let x = 0;
    function sum(){
        for(let item of info.data){
            x += item.price-0;
            // console.log(item.price);
        }
        return x;

        
    }
    sum()
    let y = 0;
    function expense(){
        for(let item of info.expenseData){
            y += item.expensePrice-0;
            // console.log(item.price);
        }
        return y;

        
    }
    expense()

   
    // console.log(data, expenseData);


    res.render("main", {
        data,
        expenseData,
        x,
        y,
       
    })


})



module.exports = {
    router,
    path: "/"
}