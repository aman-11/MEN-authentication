const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); //converting the data in json format so tht it can be read by js
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const PORT = process.env.PORT || 5000;
const dbURI = 'mongodb+srv://admin:987321@cluster0.nosxc.mongodb.net/node-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((result) => app.listen(PORT, () => console.log(`listening to port:${PORT}`)))
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));
app.use(authRoutes);

//cookies
/*app.get('/set-cookies', (req, res) => {
  
  //res.setHeader('set-cookie', 'newUser = true');
  res.cookie('newUser', false);
  res.cookie('employee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
  res.send('ypu got cookie');

})

app.get('/read-cookies', (req, res) => {
  
  const cookies = req.cookies;
  console.log(cookies.newUser);

  res.json(cookies);
  
})*/