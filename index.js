const express = require('express')
const app = express()
const port = 5000
const{User} = require("./models/User");

const config = require('./config/key');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
}).then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~~~ ')
})


app.post('/register', (req, res) => {
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



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


