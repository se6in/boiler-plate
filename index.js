const express = require('express')
const app = express()
const port = 5000
const{User} = require("./models/User");
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const{auth}= require('./middleware/auth');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~~~ ')
})


app.post('/api/users/register', (req, res) => {
  // 회원가입 시 필요한 정보를 client로부터 받아오기
  const user = new User(req.body);
  // DB에 데이터 저장
  user.save()
  .then(() => {
      return res.status(200).json({
          success: true,
      })
  })
  .catch((error) => {
      return res.send(400).json({
          success: false,
          msg: error
      })
  })
})

app.post('/api/users/login', (req, res) => {
  // 이메일이 DB에 있는지 확인
  User.findOne({
      email: req.body.email
  })
  .then (async (user) => {
      if (!user) {
          throw new Error("제공된 이메일에 해당하는 유저가 없습니다.")
      }
      // 비밀번호가 일치하는지 확인
      const isMatch = await user.comparePassword(req.body.password);
      return { isMatch, user };
  })
  .then(({ isMatch, user }) => {
      console.log(isMatch);
      if (!isMatch) {
          throw new Error("비밀번호가 틀렸습니다.")
      }
      // 로그인 완료
      return user.generateToken();
  })
  .then ((user) => {
      // 토큰 저장 (쿠키, localstorage ...)
      return res.cookie("x_auth", user.token)
      .status(200)
      .json({
          loginSuccess: true,
          userId: user._id
      });
  })
  .catch ((err) => {
      console.log(err);
      return res.status(400).json({
          loginSuccess: false,
          message: err.message
      });
  })
});


//role 0 -> 일반유저 , role 0이 아니면 관리자
app.get('/api/users/auth',auth,(req,res)=>{

    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        
        isAdmin: req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
        
    })


})

//try catch 구문으로 만들어야 가능할듯
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({
        _id: req.user._id
    }, {
        token: ""
    })
    .then(() => {
        return res.status(200).json({
            logoutSuccess: true
        });
    })
    .catch((err) => {
        return res.status(400).json({
            logoutSuccess: false,
            message: err.message
        });
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


