require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],  
    allowedHeaders: ["Content-Type"],  
    credentials: true,  
  },
});

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Database connection
const mongoOptions = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASSWORD,
  authSource: process.env.MONGO_AUTH,
};

mongoose.connect(process.env.MONGO_DATABASE, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

  const User = require('./models/User');

// Function to get unique numbers for roulette
const generateUniqueRandomNumbers = () => {
  let numbers = new Set();

  while (numbers.size < 9) {
    numbers.add(Math.floor(Math.random() * 37)); 
  }

  return [...numbers];
};

let allBets = { red: [], green: [], black: [] };
let rouletteArray = generateUniqueRandomNumbers();

let previousArray = [];
for (let i=0; i<9; i++){
  previousArray[i] = Math.floor(Math.random() * 37); 
}

let spinInterval = 40;
const animationDelay = 5000;

// Route to get roulette info
app.get('/rouletteInfo', async (req, res) => {
  try {
      res.status(200).json({
          rouletteArray: rouletteArray, 
          previousArray: previousArray,
          spinInterval: spinInterval, 
          allBets: allBets,
      });
  } catch (error) {
      console.error('Error fetching roulette info:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to randomize roulette result and payout
const spinWheel = async () => {
  rouletteArray = generateUniqueRandomNumbers();
  const result = rouletteArray[4];

  previousArray.shift(); 
  previousArray.push(result);

  console.log('Wheel spun. Result:', result);
  io.emit('spinResult', { result, bets: allBets });
  io.emit('rouletteArray', rouletteArray);
  io.emit('previousArray', previousArray);
  let winningColor;
  if (result === 0) {
      winningColor = 'green'; 
  } else if (result % 2 === 0) {
      winningColor = 'red'; 
  } else {
      winningColor = 'black';
  }

  const winningBets = allBets[winningColor];
  for (const bet of winningBets) {
      const user = await User.findOne({ username: bet.name });

      const winnings = parseFloat(bet.amount * 2); 
      user.balance = parseFloat(user.balance) + winnings;
      user.profit = parseFloat(user.profit) + winnings;

      try {
          await user.save();
      } catch (error) {
          console.error('Error saving user:', error);
      }

  }

  setTimeout(() => {
    allBets = { red: [], green: [], black: [] }; 
  }, animationDelay);
};

// Socket.IO connection
io.on('connection', (socket) => {
    socket.on('placeBet', async (data) => {
        console.log(`Bet received: ${data.name} bet ${data.amount} on ${data.color}`);
        const user = await User.findOne({ username: data.name });
        user.balance -= data.amount;
        user.profit -= data.amount; 
        await user.save();

        allBets[data.color].push(data);
        io.emit('betPlaced', data);
    });
});

// Function to update roulette timer every second
setInterval(() => {
  if (spinInterval === 0) {
      spinWheel(); 
      spinInterval = 40; 
  } else {
      spinInterval--;
  }
}, 1000);


const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Route for handling user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }
    const existingUser = await User.findOne ({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'This username is already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for handling user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

   const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for getting user info
app.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ username: user.username, email: user.email, balance: user.balance, profit: user.profit, permissions: user.permissions });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for modifying balance
app.put('/user/modifybalance', verifyToken, async (req, res) => {
  try {
    const { balance, profit } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance = balance;
    if (profit){
      user.profit = profit;
    }
    await user.save();

    res.status(200).json({ message: 'Balance added successfully' });
  } catch (error) {
    console.error('Error adding balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
