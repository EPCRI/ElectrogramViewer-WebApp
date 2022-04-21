// Annotation.js
import React from 'react';
import './Annotation.css';

export class Annotation extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("handleClick()");
        console.log(this.props.annotation);
        this.props.removeAnnotation(this.props.annotation.timeCreated);
    }

    render() {
        return (
            <div className="annotation-row">
                <div className="annotation-column ann-left">
                    {this.props.annotation.t1.toFixed(3)} - {this.props.annotation.t2.toFixed(3)} s
                </div>
                <div className="annotation-column ann-middle">
                    <input className='input-box' type={"text"}></input>
                </div>
                <div className="annotation-column ann-right">
                    <button className='delete' onClick={this.handleClick}>☓</button>
                </div>
            </div>
        )
    }
}