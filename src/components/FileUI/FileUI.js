import React from 'react';
import './FileUI.css';

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: ['File1.json', 'File2.json','File3.json','File4.json'],
            selectedFileIdx: 0,
        }
    }

    render() {
        return(
            <div className='file-input-wrapper'>
                <h2>{this.state.files[this.state.selectedFileIdx]}</h2>
                <div>
                    <select>
                        {this.state.files.map(file => {
                            return <option value={file}>{file}</option>
                        })}
                    </select>
                    <button>Load</button>
                    <button>Save</button>
                    <button>Next</button>
                </div>
            </div>
        )
    }
}

export default FileUI;