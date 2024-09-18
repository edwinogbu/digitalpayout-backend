const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const Moralis = require("moralis").default;
// const Moralis = require('moralis').default;


const setSecurityHeaders = require('./middlewares/setSecurityHeaders');
const authRoutes = require('./routes/authRoutes');
const cryptoNewsRoutes = require('./routes/cryptoNewsRoutes');
const cryptoInvestmentRoutes = require('./routes/cryptoInvestmentRoutes')
const subscriptionPlanRoutes = require('./routes/subscriptionPlanRoutes')
const testimonialRoutes = require('./routes/testimonialRoutes')
const postsDepositsRoutes = require('./routes/postDepositsRoutes')
const blogPostsRoutes = require('./routes/blogPostsRoutes')
const session = require('express-session');

// const conversationRoutes = require('./routes/conversationRoutes');

const mysql = require('mysql');
const swaggerUi = require('swagger-ui-express');   
const swaggerDocument = require('./swagger-output.json');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;
// const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(cors());

// Apply the security headers middleware to all routes
app.use(setSecurityHeaders);

// Apply security headers middleware
app.use(setSecurityHeaders);

// Configure session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Ensures cookies are only sent over HTTPS
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 30 * 60 * 1000 // Session expiration time (30 minutes)
    }
}));


// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register Swagger UI for each route
app.use('/api-docs/auth', swaggerUi.serve, swaggerUi.setup(authRoutes.swaggerDocument));

// app.use('/api-docs/chat', swaggerUi.serve, swaggerUi.setup(conversationRoutes.swaggerDocument));
// app.use('/api-docs/chatting', swaggerUi.serve, swaggerUi.setup(chattingRoutes.swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cryptonews', cryptoNewsRoutes);
app.use('/api/crypto', cryptoInvestmentRoutes);
app.use('/api/subscription', subscriptionPlanRoutes);
app.use('/api/testimonial', testimonialRoutes);
app.use('/api/postDeposits', postsDepositsRoutes)
app.use('/api/blogs', blogPostsRoutes)



app.use('/api-docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Start server
// Default route



// API endpoint to get tokens for a given address
app.get('/getTokens', async (req, res, next) => {
    const { userAddress, chain } = req.query;

    if (!userAddress || !chain) {
        return res.status(400).json({ error: 'Missing required query parameters: userAddress, chain' });
    }

    try {
        const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
            chain:chain,
            address: userAddress,
        });

        const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
            chain:chain,
            address: userAddress,
            mediaItems: true,
        });

        const balance = await Moralis.EvmApi.balance.getNativeBalance({
            chain:chain,
            address: userAddress,
        });

        console.log('====================================');
        console.log(nfts.raw.result);
        console.log('====================================');

        const myNfts = nfts.raw.result.map((e, i)=>{
            if (e?.media?.media_collection?.high?.url && !e.possible_spam && (e?.media?.category !== "video")){
                return e["media"]["media_collection"]["high"]["url"];
            }
        })

        const jsonResponse ={
            tokens: tokens.raw,
            nfts:myNfts,
            balance:balance.raw.balance / (10 ** 18),
        }

        return res.status(200).json(jsonResponse);
    } catch (error) {
        next(error);
    }
});


// API endpoint to get the top cryptocurrencies by trading volume
app.get('/getTopCryptosByVolume', async (req, res, next) => {
    
try {
    await Moralis.start({
      apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImZiZWY0NjcwLTk5ZjctNGE2Ni1iYTMyLWZkMTBiMzU3Yjk4ZCIsIm9yZ0lkIjoiMzk3MTg2IiwidXNlcklkIjoiNDA4MTI5IiwidHlwZUlkIjoiNDg3NmYxOTYtYzdiNS00MGViLWI5ZjQtNWY4Njk5YTlmNDQ3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTg4OTc0OTgsImV4cCI6NDg3NDY1NzQ5OH0.F0e9O2dDNUXYaftrWyI7zfJFlTrP2YHpmzuDA6DzeKA"
    });
  
    const response = await Moralis.EvmApi.marketData.getTopCryptoCurrenciesByTradingVolume({});
  
    console.log(response.raw);
  } catch (e) {
    console.error(e);
  }
});


Moralis.start({ 
    apiKey:process.env.MORALIS_APP_ID,
 }).then(() => {
    app.listen(PORT, ()=>{
        console.log('====================================');
        console.log(`Listening for API Calls`);
        console.log('====================================');
    });
 });


app.get('/', (req, res) => {
    res.send('Welcome to the API server');
});


// const serverUrl = process.env.MORALIS_SERVER_URL;
// const appId = process.env.MORALIS_APP_ID;

// Moralis.start({ serverUrl, appId })
//     .then(() => {
//         console.log('Moralis initialized');
//     })
//     .catch(error => {
//         console.error('Error initializing Moralis:', error);
//     });

// API endpoint to get tokens for a given address
// app.get('/api/tokens/:address', async (req, res) => {
//     const { address } = req.params;

//     try {
//         const options = { chain: 'eth', address };
//         const tokens = await Moralis.Web3API.account.getTokenBalances(options);
//         res.json(tokens);
//     } catch (error) {
//         console.error('Error fetching tokens:', error);
//         res.status(500).json({ error: 'Error fetching tokens' });
//     }
// });

// app.get("/getTokens", async(req, res){
//     const { userAddress, chain } = req.query;
//    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
//     chain:chain,
//     address:userAddress,
//    });

//    const jsonResponse = {
//     tokens:tokens.raw
//    }

//    return res.status(200).json(jsonResponse);
// });


// Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
