const express = require('express');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());


app.use(fileUpload());


const dbURI = 'mongodb+srv://shahkhushi3107:yQepqC7HS5FMQg4e@cluster0.tuffxwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));


const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyAddress: { type: String },
  companyPhone: { type: String },
  companyEmail: { type: String },
  companyWebsite: { type: String },
  numberOfEmployees: { type: Number },
  foundedDate: { type: Date },
  industryType: { type: String, enum: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Other'], required: true }
});

const contactSchema = new mongoose.Schema({
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  dateOfBirth: { type: Date },
  contactType: { type: String, enum: ['Primary', 'Secondary', 'Other'], required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

const Company = mongoose.model('Company', companySchema);
const Contact = mongoose.model('Contact', contactSchema);


app.post('/api/upload/company', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data); 
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

 
    for (const data of jsonData) {
      const company = new Company(data); 
      await company.save();
    }

    res.json({ message: 'Company data uploaded successfully' });
  } catch (err) {
    console.error('Error uploading company data:', err);
    res.status(500).json({ message: 'Failed to upload company data. Please try again.' });
  }
});

app.post('/api/upload/contact', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data); 
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    for (const data of jsonData) {
      const contact = new Contact(data); 
      await contact.save();
    }

    res.json({ message: 'Contact data uploaded successfully' });
  } catch (err) {
    console.error('Error uploading contact data:', err);
    res.status(500).json({ message: 'Failed to upload contact data. Please try again.' });
  }
});

app.get('/api/company', async (req, res) => {
  try {
    const companies = await Company.find(); 
    res.json(companies); 
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ message: 'Failed to fetch companies. Please try again.' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find(); 
    res.json(contacts); 
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Failed to fetch contacts. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
