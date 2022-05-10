import React from 'react';
import styles from './FileUI.module.css';
import { getFileNames, getAnnotationNames, saveAnnotationData } from '../../utils/fileIO';

class FileUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            formFileIdx: this.props.currentFileIdx,
            AVD: '-',
            VVD: '-',
            IVD: '-',
            PacingBPM: '-',
            TrialRun: '-',
            special: '',
            animal: '',
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
        const stringArr = filename.toLowerCase().split('_');
        const AVD = stringArr[stringArr.indexOf('avd') + 1];
        const VVD = stringArr[stringArr.indexOf('vvd') + 1];
        const IVD = stringArr[stringArr.indexOf('ivd') + 1];
        const trialRun = stringArr.filter(element => element[0].toLowerCase() === 'x')[0].replace('.json', '').replace('x', '');
        const animal = stringArr.filter(element => element.includes('animal'))[0].split('animal')[1];
        let pacing = '';
        if (stringArr.filter(element => element.toLowerCase().includes('bpm'))[0] === stringArr[stringArr.indexOf('bpm')]) {
            pacing = stringArr[stringArr.indexOf('bpm') - 1]
        } else {
            pacing = stringArr.filter(element => element.toLowerCase().includes('bpm'))[0].split('bpm')[0];
        }
        const special = stringArr.indexOf('only') === -1 ? '' : stringArr[stringArr.indexOf('only') - 1];
        console.log(special);
        this.setState({
            AVD: AVD === stringArr[0] ? '-' : AVD,
            VVD: VVD === stringArr[0] ? '-' : VVD,
            IVD: IVD === stringArr[0] ? '-' : IVD,
            PacingBPM: pacing,
            TrialRun: trialRun ? trialRun : '-',
            special: special,
            animal: animal,
        })
    }

    handleChange(event) {
        event.preventDefault();
        const fileIdx = event.target.value
        console.log(fileIdx);
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

    async handleNext(event) {
        await this.handleSave(event);
        event.preventDefault();
        const fileIdx = parseInt(this.props.currentFileIdx);
        const newFileIdx = fileIdx + 1;
        console.log(newFileIdx);
        this.setState({formFileIdx: newFileIdx});
        this.props.changeFile(newFileIdx);
        this.props.setFileWasUpdated(true);
        this.props.setLoaderVisible(true);
        this.parseFileName(this.state.files[fileIdx]);
    }

    async handleSave(event) {
        event.preventDefault();
        const response = await saveAnnotationData(this.props.currentFileIdx, this.props.annotations);
        this.props.addAnnotationFile(this.state.files[this.props.currentFileIdx]);
        this.props.setEdited(false);
        if (response.result !== "successful") {
            alert("Something went wrong");
        }
    }

    render() {
        return(
            <div className={styles['file-wrapper']}>
                <div className={styles['file-input-wrapper']}>
                    <div>
                        <div className={styles['file-interface']}>
                            <select styles={{width: "20%"}} value={this.state.formFileIdx} onChange={this.handleChange}>
                                {this.annotationOptions()}
                            </select>
                            <button onClick={this.handleLoad}>Load</button>
                            <button onClick={this.handleSave}>Save</button>
                            <button onClick={this.handleNext}>Next</button>
                        </div>
                    </div>
                </div>
                <div className={styles['file-information']}>
                    <div className={styles['parameters']}>
                        Animal: {this.state.animal}
                    </div>
                    {this.state.special && 
                    <div className={styles['parameters1']}>
                        {this.state.special.toUpperCase()} only pacing
                    </div>  }
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
                        HR: {this.state.PacingBPM} bpm
                    </div>
                    <div className={styles['parameters']}>
                        Trial: {this.state.TrialRun}
                    </div>
                </div>
                <div style={{margin: '.5vw', paddingLeft: '10vw', fontSize: 'larger', color: 'orange'}}>
                    {this.props.annotations.length} / 3 Annotations
                </div>
                <div style={{right: '2vw', position: 'absolute', fontSize: 'xx-large'}}>
                    {this.props.edited ? <div></div> : <div style={{color: 'green'}}>💾</div>}
                </div>
            </div>
        )
    }
}

export default FileUI;