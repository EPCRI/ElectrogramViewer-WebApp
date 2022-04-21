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
                <h3 style={{'textAlign': 'left', marginLeft: 10, marginTop: 10, marginBottom: 0}}>{this.state.files[this.state.selectedFileIdx]}</h3>
                <div style={{display: 'flex','alignContent': 'left', marginLeft: 10, marginBottom: 10}}>
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