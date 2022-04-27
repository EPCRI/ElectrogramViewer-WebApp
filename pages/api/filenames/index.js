const fs = require('fs');
const dirPath = './data/recordings';

export function getFileNames(arr, callback) {
    // read recording file names
    fs.readdir(dirPath, (err, files) => {
        files.forEach(file => {
            arr.push(file);
        });
        callback(arr);
    });
}


export default (req, res) => {
    return new Promise( resolve => {
        const { method } = req;
  
        switch (method) {
          case 'GET':
            const { query: { id } } = req;
            getFileNames([], (recordings) => {
                res.status(200).json({
                    method: 'GET', 
                    endpoint: 'filenames',
                    files: recordings
                });
            });
            break;
          default:
            res.setHeader('Allow', ['GET']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
        }
    })
}