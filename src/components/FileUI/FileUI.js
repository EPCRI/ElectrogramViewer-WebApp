import React from 'react';
import styles from './FileUI.module.css';
import { getFileNames, getAnnotationNames, saveAnnotationData } from '../../utils/fileIO';
import { BallTriangle } from  'react-loader-spinner'

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            formFileIdx: 0,
            AVD: '-',
            VVD: '-',
            IVD: '-',
            PacingBPM: '-',
            TrialRun: '-',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    async componentDidMount() {
        try {
            let fileNames = await getFileNames();
            this.parseFileName(fileNames[this.props.currentFileIdx])
            this.setState({ files: fileNames, formFileIdx: 0 });
        } catch (err) {
            console.log(err);
        }
    }

    annotationOptions() {
        const annotationFiles = this.props.annotationFiles;
        let optionsArr = [];
        console.log(annotationFiles);
        if (this.state.files.length > 0) {
            optionsArr = this.state.files.map((file, index) => {
                if (annotationFiles.includes(file)) {
                    return <option style={{backgroundColor: 'lightgreen'}} key={index} value={index}>{file}</option>
                } else {
                    return <option key={index} value={index}>{file}</option>
                }
            })
        }
        return optionsArr;
    }

    parseFileName(filename) {
        const stringArr = filename.split('_');
        const AVD = stringArr[stringArr.indexOf('AVD') + 1];
        const VVD = stringArr[stringArr.indexOf('VVD') + 1];
        const IVD = stringArr[stringArr.indexOf('IVD') + 1];
        const trialRun = stringArr.at(-2);
        const pacing = stringArr.at(-1).split('.')[0];
        this.setState({
            AVD: AVD ? AVD : '-',
            VVD: VVD ? VVD : '-',
            IVD: IVD ? IVD : '-',
            PacingBPM: pacing ? pacing : '-',
            TrialRun: trialRun ? trialRun : '-'
        })
    }

    handleChange(event) {
        event.preventDefault();
        const fileIdx = event.target.value
        this.setState({formFileIdx: fileIdx});
    }

    handleLoad(event) {
        event.preventDefault();
        const fileIdx = parseInt(this.state.formFileIdx);
        this.props.changeFile(fileIdx);
        this.props.setFileWasUpdated(true);
        this.props.setLoaderVisible(true);
        this.parseFileName(this.state.files[fileIdx]);
    }

    handleNext(event) {
        event.preventDefault();
        const fileIdx = parseInt(this.props.currentFileIdx);
        const newFileIdx = fileIdx + 1;
        this.props.changeFile(newFileIdx);
        this.props.setFileWasUpdated(true);
        this.props.setLoaderVisible(true);
        this.parseFileName(this.state.files[fileIdx]);
    }

    async handleSave(event) {
        event.preventDefault();
        console.log(this.props.annotations);
        const response = await saveAnnotationData(this.props.currentFileIdx, this.props.annotations);
        console.log(this.state.files[this.props.currentFileIdx]);
        this.props.addAnnotationFile(this.state.files[this.props.currentFileIdx]);
        if (response.result === "successful") {
            alert("Successfully saved file");
        } else {
            alert("Something went wrong");
        }
    }

    render() {
        return(
            <div className={styles['file-wrapper']}>
                <div className={styles['file-input-wrapper']}>
                    <div>
                        <div className={styles['file-interface']}>
                            <select value={this.props.currentFileIdx} onChange={this.handleChange}>
                                {this.annotationOptions()}
                            </select>
                            <button onClick={this.handleLoad}>Load</button>
                            <button onClick={this.handleSave}>Save</button>
                            <button onClick={this.handleNext}>Next</button>
                        </div>
                    </div>
                    <div className={styles['file-information']}>
                        <div className={styles['parameters']}>
                            AVD: {this.state.AVD}  
                        </div>  
                        <div className={styles['parameters']}>
                            VVD: {this.state.VVD}  
                        </div>  
                        <div className={styles['parameters']}>
                            IVD: {this.state.IVD}  
                        </div>  
                        <div className={styles['parameters']}>
                            Pacing BPM: {this.state.PacingBPM}
                        </div>
                        <div className={styles['parameters']}>
                            Trial Run: {this.state.TrialRun}
                        </div>
                    </div>
                </div>
                {this.props.loaderVisible &&
                    <div>
                        <BallTriangle
                            height="70"
                            width="70"
                            color="grey"
                            ariaLabel="loading-indicator"
                        />
                    </div>
                }
            </div>
        )
    }
}

export default FileUI;