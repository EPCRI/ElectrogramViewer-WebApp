import React from 'react';
import styles from './FileUI.module.css';
import { getFileNames } from '../../utils/fileIO';

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            selectedFileIdx: 0,
        }
        this.handleLoad = this.handleLoad.bind(this);
    }

    async componentDidMount() {
        try {
            console.log("componentDidMount()");
            let fileNames = await getFileNames();
            this.setState({ files: fileNames });
        } catch (err) {
            console.log(err);
        }
    }

    handleLoad(event) {
        
    }

    render() {
        return(
            <div className={styles['file-input-wrapper']}> {console.log(this.props.allFiles)}
                <h3 style={{'textAlign': 'left', marginLeft: 10, marginTop: 10, marginBottom: 0}}>{this.state.files[this.state.selectedFileIdx]}</h3>
                <div style={{display: 'flex','alignContent': 'left', marginLeft: 10, marginBottom: 10}}>
                    <select>
                        {this.state.files.map(file => {
                            return <option value={file}>{file}</option>
                        })}
                    </select>
                    <button onClick={this.handleLoad}>Load</button>
                    <button>Save</button>
                    <button>Next</button>
                </div>
            </div>
        )
    }
}

export default FileUI;