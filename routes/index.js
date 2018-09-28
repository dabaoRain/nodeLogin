var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", (req,res) => {
  res.render('login', {title: '用户登录'})
});
router.post("/loginIn", (req,res) => {
   console.log(req.body);
   var user = {
     username: 'admin998',
	 password: '123456'
   }
   if(req.body.username === user.username && req.body.password === user.password){
	  req.session.user = user;
	  res.redirect('/home'); 
   } else {
	 req.session.error='用户名或密码不正确';  
	 res.redirect('/login');
   }
});


router.get("/home", (req,res) => {
  acthentication(req,res);
  res.render('home', {title: 'Home',user:req.session.user.username})
});



router.get("/loginout", (req,res) => {
  req.session.user = null;
  res.redirect('/'); 
})


function acthentication(req,res) {
   if(!req.session.user){
	 req.session.error='请先登录';
     return res.redirect('/login');  
   }
}





module.exports = router;
