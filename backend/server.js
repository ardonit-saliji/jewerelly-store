const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 5000;
const cors = require('cors');
const routesUrls = require('./routes/routes2');
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.set('strictQuery', false);
try {
  mongoose.connect(
    process.env.DATABASE_ACCESS,
    { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'jewerelly' },
    () => console.log('Database Connected')
  );
} catch (error) {
  console.log(error.message);
}

app.use('/', routesUrls);
app.use('/products', productRoutes);
app.use('/user', userRoutes);

app.listen(port, () => console.log(`Server started at port ${port}`));
