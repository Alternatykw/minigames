require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// SMTP config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USER, 
    pass: process.env.GOOGLE_APP_PASS,
  },
});

// Function to send an email
async function sendMail(mailOptions) {
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

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

        const existingBetIndex = allBets[data.color].findIndex(bet => bet.name === data.name);
            if (existingBetIndex !== -1) {
              allBets[data.color][existingBetIndex].amount = 
              parseFloat(allBets[data.color][existingBetIndex].amount) + parseFloat(data.amount);
            } else {
                allBets[data.color].push(data);
            }
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
  const { code } = req.body;

  if (!token || token==="Bearer null") {
    return res.status(401).json({
      message: code ? 'You need to log in to activate the account' : 'Unauthorized: No token provided'
    });
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
  const activationCode = crypto.randomBytes(6).toString('base64').slice(0, 8);

  try {
    const existingEmail = await User.findOne({ email, active: true });
    if (existingEmail) {
      return res.status(400).json({ message: 'This email is already registered' });
    }
    
    const existingUser = await User.findOne ({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'This username is already taken' });
    }

    const mailOptions = {
      from: `Minigames ${process.env.GOOGLE_USER}`,
      to: email,
      subject: 'Minigames account activation',
      html: `<h2>To activate your account, click on the link below:</h2>
             <a href="http://localhost:3000/activate?code=${activationCode}">Click Here!</a>
             <p>If the link doesn't work, just paste this code instead: ${activationCode}<p>`,
    };
    sendMail(mailOptions);

    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = new User({ username, email, password: hashedPassword, code: activationCode });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for sending email again
app.post('/sendagain', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const activationCode = user.code;

    const mailOptions = {
      from: `Minigames ${process.env.GOOGLE_USER}`,
      to: user.email,
      subject: 'Minigames account activation',
      html: `<h2>To activate your account, click on the link below:</h2>
             <a href="http://localhost:3000/activate?code=${activationCode}">Click Here!</a>
             <p>If the link doesn't work, just paste this code instead: ${activationCode}<p>`,
    };
    sendMail(mailOptions);

    res.status(200).json({
      message: 'Code sent again'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
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
    res.status(200).json({ username: user.username, email: user.email, balance: user.balance, profit: user.profit, permissions: user.permissions, active: user.active, code: user.code });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for deleting user info
app.delete('/user', verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Account sucessfully removed'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
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

// Route for fetching profit leaderboards
app.get('/profits', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ profit: -1 }) 
      .limit(10) 
      .select('username profit -_id'); 

    const bottomUsers = await User.find()
      .sort({ profit: 1 }) 
      .limit(10) 
      .select('username profit -_id'); 

    res.status(200).json({ 
      topUsers, 
      bottomUsers 
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the data' });
  }
});

// Route for activating an user
app.post('/activate', verifyToken, async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findById(req.user.userId);

    if (user.active) {
      return res.status(201).json({ message: 'Account is already activated.' });
    }

    console.log(code);
    if (code && code === user.code){
      user.code = '';
      user.active = true;

      await user.save();
      return res.status(200).json({ message: 'User activated successfully' });
    }

    res.status(401).json({ message: "Code doesn't match" });
  } catch (error) {
    console.error('Error activating user: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to check user password
app.post('/check-password', verifyToken, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        return res.status(200).json({ message: 'Password is correct' });
    } else {
        return res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error checking password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for sending a password reset link
app.post('/passlink', async (req, res) => {
  const { email } = req.body;
  const passCode = crypto.randomBytes(6).toString('base64').slice(0, 8);

  try {
    const user = await User.findOne({ email, active: true });

    if (!user) {
      return res.status(404).json({ message: 'This email is not registered' });
    }

    const mailOptions = {
      from: `Minigames ${process.env.GOOGLE_USER}`,
      to: email,
      subject: 'Minigames account password change',
      html: `<h2>To change your account's password, click on the link below:</h2>
             <p><a href="http://localhost:3000/passreset?code=${passCode}"> >>> Click Here! <<< </a></p>
             <p>If the link doesn't work, just paste this code instead: ${passCode}<p>
             <p>If you haven't requested a password reset, ignore this email.</p>`,
    };
    sendMail(mailOptions);

    user.code = passCode;
    await user.save();

    res.status(200).json({ message: 'Password link sent successfully' });
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for checking the password reset code
app.post('/passcode', async (req, res) => {
  const { code } = req.body;

  try {
    if (!code){
      return res.status(404).json({ message: 'No password reset code present' });
    }

    const user = await User.findOne({ code });

    if (code !== user.code){
      return res.status(401).json({ message: 'Invalid password reset code' });
    }

    await user.save();

    res.status(200).json({ message: 'Code valid', userId: user._id });
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for changing password
app.post('/passreset', async (req, res) => {
  const { userId, username, newPassword } = req.body;

  try {
    const query = {};
    if (userId) {
      query._id = userId;
    } else if (username) {
      query.username = username;
    } else {
      return res.status(400).json({ message: 'userId or username is required' });
    }

    const user = await User.findOne(query); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.code = '';
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// There should be a code expiration in the database and routes should check it but im lazy, chance to get the same code is relatively low (but never zero)