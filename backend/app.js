const viewRoutes = require('./routes/view');
const linkRoutes = require('./routes/links');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./services/passport'); // 👈 This loads the strategy
const authRoutes = require('./routes/auth');
const githubRoutes = require('./routes/github');



const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Session config (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/links', linkRoutes.router);
app.use('/view', viewRoutes); 

// Simple test route
app.get('/', (req, res) => {
  res.send('Privolio API is live!');
});
module.exports = app;