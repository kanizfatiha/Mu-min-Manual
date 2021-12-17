const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const sessions = require("express-session");
const oneDay = 1000*60*60*24;

app.use(
    sessions({
        secret: "secret",
        saveUninitialized : true,
        cookie:{maxAge:oneDay},
        resave:false,
    })
);

require("./db/conn");
const User = require("./models/registration");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname , "../public");
const templates_path = path.join(__dirname , "../templates/views");
const partials_path = path.join(__dirname , "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard")
});

app.get("/registration", (req, res) => {
    res.render("registration")
});


//create new user in database
app.post("/registration", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                // Store hash in your password DB.
                
                const registerUser = new User({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                emailid : req.body.emailid,
                phoneno : req.body.phoneno,
                address : req.body.address,
                zipcode : req.body.zipcode,
                gender : req.body.gender,
                password : hash,
                confirmpassword : req.body.confirmpassword
            })
            
            const registered = await registerUser.save();
            res.status(201).render("index");
        });

        }else{
            res.send("Passwords are not matching.")
        }

    } catch (error) {
        res.status(400).send(error);      
    }
    
});

app.get("/login", (req, res) => {
    res.render("login")
});


//check login
app.post("/login", async(req, res) => {
     try {

        const emailid  = req.body.emailid;
        const password = req.body.password;

        const useremail = await User.findOne({emailid:emailid});
        
        bcrypt.compare(password, useremail.password, function(err, result) {
            // result == false
            if(result ===true && useremail.emailid == emailid){
                const session = req.session;
                session.emailid = emailid;
                const user = req.session.emailid;
                const info = {
                    user: user,
                };
                res.status(201).render("dashboard",{
                    userEmail:session.emailid,
                    encodedJson: encodeURIComponent(JSON.stringify(info))
                });
            }else{
                res.send("Invalid login details");
            }
            
        });
        } catch (error) {
            res.status(400).send("error"); 
     }
});

app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})