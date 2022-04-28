const fs = require('fs');
import { getFileNames } from '../filenames';
import { getAnnotationNames } from '../annotationnames';
const dirPath = '../data/recordings/';
const annotationPath = '../data/annotations/';


export default (req, res) => {
    const { query: { annotation } } = req;
    getFileNames([], (recordings) => {
        getAnnotationNames([], (annotations) => {
            console.log("HERE: " + annotation);
            const parsedFileIdx = parseInt(annotation);
            if (parsedFileIdx !== undefined && !isNaN(parsedFileIdx) && parsedFileIdx < recordings.length) {
                const file = recordings[parsedFileIdx];
                if (annotations.includes(file)) {
                    fs.readFile(annotationPath + file, (err, data) => {
                        if (err) throw err;
                        let annotationData = JSON.parse(data);
                        res.status(200).json({
                            method: 'GET', 
                            endpoint: 'getannotation',
                            fileExists: true,
                            fileName: file,
                            data: annotationData
                        });
                    });
                } else {
                    res.status(200).json({
                        method: 'GET', 
                        endpoint: 'getannotation',
                        fileExists: false,
                        fileName: file
                    });
                }
            } else {
                return res.status(404).json({
                    status: 404,
                    message: 'Not Found'
                });
            }
        });
    });
}
