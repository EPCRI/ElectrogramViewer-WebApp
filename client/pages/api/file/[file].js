// [files].js
import { getFileNames } from '../filenames';
const fs = require('fs');
const dirPath = './../recordings/';
let fileNames = [];

export default async (req, res) => {
    const { query: { file } } = req;
    getFileNames([], (recordings) => {
        const parsedFileIdx = parseInt(file);
        if (!isNaN(parsedFileIdx) && parsedFileIdx < recordings.length) {
            let recordingData = {};
            const file = recordings[parsedFileIdx];
            fs.readFile(dirPath + file, (err, data) => {
                if (err) throw err;
                recordingData = JSON.parse(data);
                res.status(200).json({
                    method: 'GET', 
                    endpoint: 'file',
                    file: recordingData
                });
            });
        } else {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            });
        }
    });
}