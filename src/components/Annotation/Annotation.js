// Annotation.js
import React from 'react';
import './Annotation.css';

export class Annotation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passedInComment: this.props.annotation.comment,
            currentComment: ''
        };
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleDeleteClick() {
        console.log("handleClick()");
        console.log(this.props.annotation);
        this.props.removeAnnotation(this.props.annotation.timeCreated);
    }

    handleCommentClick() {
        console.log("handleCommentClick()");
        this.props.addComment(this.props.annotation.timeCreated, this.state.currentComment);
    }

    handleChange(event) {
        this.setState({currentComment: event.target.value});
    }

    render() {
        return (
            <div className="annotation-row">
                <div className="annotation-column ann-left">
                    {this.props.annotation.t1.toFixed(3)} - {this.props.annotation.t2.toFixed(3)} s
                </div>
                <div className="annotation-column ann-middle">
                    <input className='input-box' type="text" value={this.state.currentComment} onChange={this.handleChange}></input>
                </div>
                <div className="annotation-column ann-right">
                    <button className="comment-button" onClick={this.handleCommentClick}>✓</button>
                    <button className="comment-button" onClick={this.handleDeleteClick}>☓</button>
                </div>
            </div>
        )
    }
}