import React from 'react';
import styles from './FileUI.module.css';
import { getFileNames } from '../../utils/fileIO';

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            formFile: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    async componentDidMount() {
        try {
            let fileNames = await getFileNames();
            this.setState({ files: fileNames, formFile: fileNames[0] });
        } catch (err) {
            console.log(err);
        }
    }

    handleChange(event) {
        const fileIdx = event.target.value
        console.log(fileIdx);
        this.setState({formFile: fileIdx});
    }

    handleLoad(event) {
        const fileName = this.state.formFile;
        this.props.changeFile(fileName);
        this.props.setFileWasUpdated(true);
        event.preventDefault();
    }

    render() {
        return(
            <div className={styles['file-input-wrapper']}>
                <h3 style={{'textAlign': 'left', marginLeft: 10, marginTop: 10, marginBottom: 0}}>{this.state.files[this.state.selectedFileIdx]}</h3>
                <div style={{display: 'flex','alignContent': 'left', marginLeft: 10, marginBottom: 10}}>
                    <select onChange={this.handleChange}>
                        {this.state.files.map((file, index) => {
                            return <option key={index} value={index}>{file}</option>
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