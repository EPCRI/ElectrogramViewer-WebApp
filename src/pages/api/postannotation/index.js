const fs = require('fs');
import { getFileNames } from '../filenames';
import { getAnnotationNames } from '../annotationnames';
const dirPath = '../data/recordings/';
const annotationPath = '../data/annotations/';


export default function handler(req, res) {
    return new Promise( resolve => {
        const { method, body } = req;
        const call = body.call
        const annotationFileIdx = body.fileIdx;
        getFileNames([], (files) => {
            getAnnotationNames([], (annFiles) => {
                switch (call) {
                    case 'SAVE':
                        console.log("API: postannotation - SAVE");
                        const flagged = body.flagged;
                        const parsedFileIdx = parseInt(annotationFileIdx);
                        if (parsedFileIdx !== undefined && !isNaN(parsedFileIdx) && parsedFileIdx < files.length) {
                            let file = files[parsedFileIdx];
                            file = file.replace(".json", "_annotation.json");
                            console.log(annotationPath + file);
                            body.filename = file;
                            if (annFiles.includes("FLAG_".concat(file))) {
                                try {
                                    fs.unlinkSync(annotationPath + "FLAG_" + file);
                                } catch(err) {
                                    console.error(err);
                                }
                            }
                            fs.writeFile(annotationPath + file, JSON.stringify(body), (err) => {
                                if (err) throw err;
                                console.log('Data written to file');
                            });
                            res.status(200).json({
                                method: 'SAVE', 
                                endpoint: 'postannotation',
                                file: file,
                                result: 'successful'
                            });
                        } else {
                            console.log("ERROR SERVER SIDE");
                            return res.status(404).json({
                                status: 404,
                                message: 'Not Found'
                            });
                        }
                        break;

                    case 'FLAG':
                        console.log("API: postannotation - FLAG");
                        const parsedFileIdx1 = parseInt(annotationFileIdx);
                        if (parsedFileIdx1 !== undefined && !isNaN(parsedFileIdx1) && parsedFileIdx1 < files.length) {
                            let file = files[parsedFileIdx1];
                            file = file.replace(".json", "_annotation.json");
                            file = "FLAG_" + file;
                            console.log(annotationPath + file);
                            body.filename = file;
                            if (annFiles.includes(file)) {
                                try {
                                    fs.unlinkSync(annotationPath + file);
                                } catch(err) {
                                    console.error(err);
                                }
                            }
                            fs.writeFile(annotationPath + file, JSON.stringify(body), (err) => {
                                if (err) throw err;
                                console.log('Data written to file');
                            });
                            res.status(200).json({
                                method: 'FLAG', 
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
                        break;
                    case 'DELETE':
                        console.log("Delete annotation");
                        const parsedFileIdx2 = parseInt(annotationFileIdx);
                        if (parsedFileIdx2 !== undefined && !isNaN(parsedFileIdx2) && parsedFileIdx2 < files.length) {
                            let file = files[parsedFileIdx2];
                            console.log(file);
                            console.log(annFiles);
                            if (annFiles.includes(file)) {
                                try {
                                    file = file.replace(".json", "_annotation.json");
                                    fs.unlinkSync(annotationPath + file);
                                } catch(err) {
                                    console.error(err);
                                }
                            }
                            if (annFiles.includes("FLAG_".concat(file))) {
                                try {
                                    file = file.replace(".json", "_annotation.json");
                                    fs.unlinkSync(annotationPath + "FLAG_" + file);
                                } catch(err) {
                                    console.error(err);
                                }
                            }
                            body.filename = file;
                            res.status(200).json({
                                method: 'DELETE', 
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
                        break;
                    default:
                        res.setHeader('Allow', ['SAVE', 'FLAG', 'DELETE']);
                        res.status(405).end(`Method ${method} Not Allowed`);
                        break;
                }
            });
        });
    })
}
