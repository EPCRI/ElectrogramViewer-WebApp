const fs = require('fs');
const dirPath = '~/../data/annotations/';

export function getAnnotationNames(arr, callback) {
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
            getAnnotationNames([], (annotationfiles) => {
                res.status(200).json({
                    method: 'GET', 
                    endpoint: 'annotationnames',
                    files: annotationfiles
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