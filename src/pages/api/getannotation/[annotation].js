const fs = require('fs');
import { getFileNames } from '../filenames';
import { getAnnotationNames } from '../annotationnames';
const dirPath = '../data/recordings/';
const annotationPath = '../data/annotations/';


export default function handler(req, res) {
    const { query: { annotation } } = req;
    getFileNames([], (recordings) => {
        getAnnotationNames([], (annotations) => {
            console.log("HERE: " + annotation);
            console.log(annotations);
            const parsedFileIdx = parseInt(annotation);
            if (parsedFileIdx !== undefined && !isNaN(parsedFileIdx) && parsedFileIdx < recordings.length) {
                let file = recordings[parsedFileIdx];
                console.log(file);
                if (annotations.includes(file)) {
                    file = file.replace(".json", "_annotation.json");
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
                }else if(annotations.includes("FLAG_" + file)) {
                    file = file.replace(".json", "_annotation.json");
                    fs.readFile(annotationPath + "FLAG_" + file, (err, data) => {
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
