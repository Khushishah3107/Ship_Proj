import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const UploadForm = () => {
  const [companyFile, setCompanyFile] = useState(null);
  const [contactFile, setContactFile] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false); 


  const fetchCompanyData = async () => {
    try {
      const backendURL = 'http://localhost:3001'; 
      const response = await axios.get(`${backendURL}/api/company`);
      setCompanyData(response.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };


  const fetchContactData = async () => {
    try {
      const backendURL = 'http://localhost:3001'; 
      const response = await axios.get(`${backendURL}/api/contact`);
      setContactData(response.data);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };


  const handleCompanyFileChange = (e) => {
    setCompanyFile(e.target.files[0]);
    displayFileData(e.target.files[0], 'company');
  };


  const handleContactFileChange = (e) => {
    setContactFile(e.target.files[0]);
    displayFileData(e.target.files[0], 'contact');
  };

  
  const displayFileData = async (file, fileType) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        jsonData.shift();

        if (fileType === 'company') {
          setCompanyData(jsonData);
        } else if (fileType === 'contact') {
          setContactData(jsonData);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error displaying file data:', error);
      alert('Failed to display file data. Please try again.');
    }
  };

  const handleUpload = async (file, fileType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const backendURL = 'http://localhost:3001'; 
      const endpoint = `${backendURL}/api/upload/${fileType}`;

      await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (fileType === 'company') {
        await fetchCompanyData();
      } else if (fileType === 'contact') {
        await fetchContactData();
      }

      setUploadSuccess(true); 
      setTimeout(() => setUploadSuccess(false), 3000); 

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload data. Please try again.');
    }
  };

  useEffect(() => {
    fetchCompanyData();
    fetchContactData();
  }, []); 

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <label className="block mb-2">Upload Company File:</label>
        <input type="file" onChange={handleCompanyFileChange} className="border rounded px-4 py-2" />
        <button onClick={() => handleUpload(companyFile, 'company')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          Upload Company Data
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Upload Contact File:</label>
        <input type="file" onChange={handleContactFileChange} className="border rounded px-4 py-2" />
        <button onClick={() => handleUpload(contactFile, 'contact')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
          Upload Contact Data
        </button>
      </div>

     
      {uploadSuccess && (
        <div className="mb-4 text-green-600">
          Data uploaded successfully!
        </div>
      )}

     
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Company Details Review</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Company Name</th>
                <th className="border border-gray-400 px-4 py-2">Company Address</th>
                <th className="border border-gray-400 px-4 py-2">Company Phone</th>
                <th className="border border-gray-400 px-4 py-2">Company Email</th>
                <th className="border border-gray-400 px-4 py-2">Company Website</th>
                <th className="border border-gray-400 px-4 py-2">Number of Employees</th>
                <th className="border border-gray-400 px-4 py-2">Founded Date</th>
                <th className="border border-gray-400 px-4 py-2">Industry Type</th>
              </tr>
            </thead>
            <tbody>
              {companyData.map((company, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-400 px-4 py-2">{company[0]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[1]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[2]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[3]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[4]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[5]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[6]}</td>
                  <td className="border border-gray-400 px-4 py-2">{company[7]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Contact Details Review</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-400 px-4 py-2">Contact Name</th>
                <th className="border border-gray-400 px-4 py-2">Contact Email</th>
                <th className="border border-gray-400 px-4 py-2">Contact Phone</th>
                <th className="border border-gray-400 px-4 py-2">Date of Birth</th>
                <th className="border border-gray-400 px-4 py-2">Contact Type</th>
              </tr>
            </thead>
            <tbody>
              {contactData.map((contact, index) => (
                <tr key={index} className="bg-white">
                  <td className="border border-gray-400 px-4 py-2">{contact[0]}</td>
                  <td className="border border-gray-400 px-4 py-2">{contact[1]}</td>
                  <td className="border border-gray-400 px-4 py-2">{contact[2]}</td>
                  <td className="border border-gray-400 px-4 py-2">{contact[3]}</td>
                  <td className="border border-gray-400 px-4 py-2">{contact[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
