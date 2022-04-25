// [files].js
import { getFileNames } from '../filenames';
const fs = require('fs');
const dirPath = './data/recordings/';
let fileNames = [];

export default async (req, res) => {
    const { query: { file } } = req;

    getFileNames([], (recordings) => {
        if (recordings.includes(file)) {
            let recordingData = {};
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