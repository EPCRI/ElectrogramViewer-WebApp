const fs = require('fs');
const path = require('path');

export default (req, res) => {
    const { method } = req;
  
    switch (method) {
      case 'GET':
        res.json({ method: 'GET', endpoint: 'file' });
        break;
      case 'POST':
        res.json({ method: 'POST', endpoint: 'file' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  }