const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module
const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://pramod18:<db_passw@cluster0.cny7fgt.mongodb.net/contactForm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create schema and model for form submissions
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json()); // Parse JSON bodies
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
  });
  
// API Route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
    console.log('Received request:', req.body); // Log the request body to check
    try {
      const { firstName, lastName, email, message } = req.body;
  
      // Validate input
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      // Save data to MongoDB
      const newContact = new Contact({ firstName, lastName, email, message });
      await newContact.save();
  
      res.status(201).json({ message: 'Message received successfully!' });
    } catch (error) {
      console.error('Error saving contact:', error);
      res.status(500).json({ error: 'Failed to save message.' });
    }
  });
  
// Fallback route for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});