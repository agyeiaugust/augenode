const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'cartSecretKey',
  resave: false,
  saveUninitialized: true
}));

const posts = [
  {
    id: 1,
    title: 'How to Master Financial Engineering',
    excerpt: 'Learn the key skills to become a top financial engineer...',
    content: 'This is the full content of the Financial Engineering post...',
    author: 'Agyei Augustine',
    date: 'July 10, 2025',
    price: 10
  },
  {
    id: 2,
    title: 'The Power of Learning Through Games',
    excerpt: 'Discover how gamified apps are changing education forever...',
    content: 'This is the full content of the gamification article...',
    author: 'Funda Team',
    date: 'July 8, 2025',
    price: 12
  }
];

// Home page
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    blogName: 'Funda Blog',
    posts,
    tags: ['Finance', 'Education', 'AI', 'Crypto', 'Coding']
  });
});

// Post detail
app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.render('post', { title: post.title, post });
  } else {
    res.status(404).send('Post not found');
  }
});




// Add to cart
app.post('/cart/add', (req, res) => {
  const postId = parseInt(req.body.postId);
  const post = posts.find(p => p.id === postId);
  if (!post) return res.status(404).send('Product not found');

  if (!req.session.cart) req.session.cart = [];

  const exists = req.session.cart.find(item => item.id === post.id);
  if (!exists) req.session.cart.push(post);

  res.redirect('/cart');
});

// View cart
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { title: 'Your Cart', cart });
});

// Checkout
app.get('/checkout', (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.render('checkout', { title: 'Checkout', cart, total });
});

app.post('/checkout', (req, res) => {
  req.session.cart = [];
  res.send('Thank you for your purchase!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


