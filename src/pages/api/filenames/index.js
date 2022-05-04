const fs = require('fs');
const dirPath = '../data/recordings/';

export function getFileNames(arr, callback) {
    // read recording file names
    console.log("DIRPATH HERE");
    console.log(dirPath);
    fs.readdir(dirPath, (err, files) => {
        console.log("getFileNames()");
        console.log(err);
        console.log(files);
        files.forEach(file => {
            arr.push(file);
        });
        console.log("got file names");
        callback(arr);
    });
}


export default function handler(req, res) {
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