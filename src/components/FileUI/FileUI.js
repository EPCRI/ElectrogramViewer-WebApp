import React from 'react';
import styles from './FileUI.module.css';
import { getFileNames, saveAnnotationData } from '../../utils/fileIO';

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            formFileIdx: 0,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    async componentDidMount() {
        try {
            let fileNames = await getFileNames();
            this.setState({ files: fileNames, formFileIdx: 0 });
        } catch (err) {
            console.log(err);
        }
    }

    componentDidUpdate() {
        this.formFileIdx = this.props.currentFileIdx;
    }

    handleChange(event) {
        event.preventDefault();
        const fileIdx = event.target.value
        this.setState({formFileIdx: fileIdx});
    }

    handleLoad(event) {
        event.preventDefault();
        const fileIdx = this.state.formFileIdx;
        this.props.changeFile(fileIdx);
        this.props.setFileWasUpdated(true);
    }

    handleNext(event) {
        event.preventDefault();
        const fileIdx = this.props.currentFileIdx;
        const newFileIdx = fileIdx + 1;
        this.props.changeFile(newFileIdx);
        this.props.setFileWasUpdated(true);
    }

    async handleSave(event) {
        event.preventDefault();
        console.log(this.props.annotations);
        const response = await saveAnnotationData(this.props.currentFileIdx, this.props.annotations);
        if (response.result === "successful") {
            alert("Successfully saved file");
        } else {
            alert("Something went wrong");
        }
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
                    <button onClick={this.handleSave}>Save</button>
                    <button onClick={this.handleNext}>Next</button>
                </div>
            </div>
        )
    }
}

export default FileUI;