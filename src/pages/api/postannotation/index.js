const fs = require('fs');
import { getFileNames } from '../filenames';
import { getAnnotationNames } from '../annotationnames';
const dirPath = '../data/recordings/';
const annotationPath = '../data/annotations/';


export default function handler(req, res) {
    return new Promise( resolve => {
        const { method, body } = req;
        switch (method) {
          case 'POST':
            console.log("API: postannotation");
            const annotationFileIdx = body.fileIdx;
            getFileNames([], (files) => {
                const parsedFileIdx = parseInt(annotationFileIdx);
                if (parsedFileIdx !== undefined && !isNaN(parsedFileIdx) && parsedFileIdx < files.length) {
                    let file = files[parsedFileIdx];
                    file = file.replace(".json", "_annotation.json");
                    console.log(annotationPath + file);
                    body.filename = file;
                    fs.writeFile(annotationPath + file, JSON.stringify(body), (err) => {
                        if (err) throw err;
                        console.log('Data written to file');
                    });
                    res.status(200).json({
                        method: 'GET', 
                        endpoint: 'postannotation',
                        file: file,
                        result: 'successful'
                    });
                } else {
                    return res.status(404).json({
                        status: 404,
                        message: 'Not Found'
                    });
                }
            });
            break;
          default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
        }
    })
}