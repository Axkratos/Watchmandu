const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const multer = require("multer");
require("./db/conn"); // No need to require mongoose here, as it's already required in your conn.js file
const User = require("./models/register");
const Watch = require("./models/watch");
const Purchase = require("./models/purchase"); // Import the Purchase model

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "./public/Frontend");

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/Frontend/index.html"));
});


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
    }
  },
}).single("photo");

app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.put('/upload/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, description, price } = req.body;

        // Find the product by ID
        const product = await Watch.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update the product properties
        product.name = name;
        product.description = description;
        product.price = price;

        // Save the updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
// Route to delete a watch by ID
app.delete('/delete/:id',cors() ,async (req, res) => {
    try {
        const watchId = req.params.id;

        // Check if the provided ID is valid
        if (!mongoose.Types.ObjectId.isValid(watchId)) {
            return res.status(400).json({ error: "Invalid watch ID" });
        }

        // Find the watch by ID and delete it
        const deletedWatch = await Watch.findByIdAndDelete(watchId);

        if (!deletedWatch) {
            return res.status(404).json({ error: "Watch not found" });
        }

        res.status(200).json({ message: "Watch deleted successfully", deletedWatch });
    } catch (error) {
        console.error('Error deleting watch:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});

// Route to upload a new watch
app.post("/upload", upload, async (req, res) => {
    try {
      const { title, description, price } = req.body;
  
      // Check if any required field is missing
      if (!title || !description || !price || !req.file) {
        return res.status(400).json({ error: "Please provide all required fields" });
      }
  
      // Create a new Watch instance with title, description, price, and photo path
      const newWatch = new Watch({
        title,
        description,
        price,
        photo: req.file ? req.file.buffer.toString("base64") : null,
      });
  
      // Save the new Watch instance to the database
      const savedWatch = await newWatch.save();
  
      // Respond with the saved Watch object
      res.status(201).json(savedWatch);
    } catch (error) {
      console.error("Error during watch upload:", error);
      res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
  });


app.get('/upload',cors() , async (req, res) => {
    try {
        const watches = await Watch.find(); // Retrieve all watches from the database
        res.json(watches); // Respond with the retrieved watches
    } catch (error) {
        console.error('Error fetching watch data:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});

app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send("User already exists.");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.send(`
        <script>
            alert("Registration successful! You can now login.");
            window.location.href = 'http://localhost:3000/Login%20page/Sign_up.html'; // Redirect to login page
        </script>
      `);
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    }
  });


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send('User is not found');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send('Invalid email or password');
        }

        res.redirect('index2.html');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

app.post('/purchase',upload,cors() , async (req, res) => {
    try {
        const { name, address, phone, paymentMethod } = req.body;
        console.log(req.body);
        
        // Creating a new Purchase instance
        const newPurchase = new Purchase({ name, address, phone, paymentMethod, });
        
        // Saving the new purchase to the database
        const savedPurchase = await newPurchase.save();
        
        // If the purchase is successfully saved, redirect to a certain page
        res.redirect('../Cart/thank-you.html');
    } catch (error) {
        // If there's an error during purchase, send an error response
        console.error('Error during purchase:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to fetch registered users' data (name and email)
app.get('/users', async (req, res) => {
    try {
        // Fetch all registered users from the database
        const users = await User.find({}, 'name email');

        // Respond with the user data
        res.json(users);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});


app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Check if the provided ID is valid
      
      // Find the user by ID and delete it
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Define other routes and app configurations...

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});

