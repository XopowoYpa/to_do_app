import React from 'react';
import ReactDom from 'react-dom';
import 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '../src/master.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

class App extends React.Component{

    constructor(props){
        super(props);
        this.size=0;
        this.delQueue=[];
        this.isDelAll = false;
        this.state={
            items:[],
            selectStates:[]
        };
    }

    handleAddEvent=(content)=>{
        let itemTmp = this.state.items;
        itemTmp.push(content);
        let selectTmp = this.state.selectStates;
        selectTmp.push(false);
        this.setState({
            items:itemTmp,
            selectStates:selectTmp
        });
    }

    handleDelEvent=()=>{
        if(this.isDelAll){
            this.size=0;
            this.delQueue=[];
            this.isDelAll = false;
            this.selectableItems = [];
            this.setState({
                items:[]
            });
            return;
        }
        let itemTmp = this.state.items;
        let selectTmp = this.state.selectStates;
        let offset = 0;
        for(let i of this.delQueue){
            itemTmp.splice(i-offset,1);
            selectTmp.splice(i-offset++,1);
        }
        this.setState({
            items:itemTmp,
            selectStates:selectTmp
        });
    }

    delItem=(index)=>{
        this.delQueue = [];
        this.delQueue.push(index);
    }

    handleDelAllEvent=()=>{
        this.isDelAll = true;
    }

    changeSelectStates=(index,state)=>{
        let selectTmp = this.state.selectStates;
        selectTmp[index] = state;
        this.setState({
            selectStates:selectTmp
        });
    }

    handleDelSelect=()=>{
        this.delQueue = [];
        for(let i=0;i<this.state.selectStates.length; i++){
            if(this.state.selectStates[i]){
                this.delQueue.push(i);
            }
        }
    }

    render(){
        return (
            <div id="container">
                <h3>To Do</h3>
                <ListGroup items={this.state.items} selectStates={this.state.selectStates} delItem={this.delItem} changeSelectStates={this.changeSelectStates}></ListGroup>
                <button type="button" className="btn btn-primary" id="addEvent"  data-toggle="modal" data-target="#contentModalCenter">Add Event</button>
                <button type="button" className="btn btn-warning" id="delSelect"  onClick={this.handleDelSelect} data-toggle="modal" data-target="#confirmModalCenter">Delete Selection</button>
                <button type="button" className="btn btn-danger" id="delAll" onClick={this.handleDelAllEvent} data-toggle="modal" data-target="#confirmModalCenter">Delete All</button>
                <ContentModal handleAddEvent={this.handleAddEvent}></ContentModal>
                <ConfirmModal handleDelEvent={this.handleDelEvent}></ConfirmModal>
            </div>
        );
    }
}

class ListGroup extends React.Component{

    render(){
        let kids = [];
        if(this.props.items.length!==0){
            for(let i in this.props.items){
                kids.push(<ListGroupItem content={this.props.items[i]} isCompelete={this.props.selectStates[i]} index={i} delItem={this.props.delItem} changeSelectStates={this.props.changeSelectStates}></ListGroupItem>);
            }
        }
        else{
            return (
                <ul className="list-group">
                    <div id="noEvent">No Event Here Now</div>
                </ul>
            );
        }

        return (
            <ul className="list-group">
                {kids}
            </ul>
        );
    }
}

class ListGroupItem extends React.Component{

    handleItemCompelete=()=>{
        this.props.changeSelectStates(parseInt(this.props.index),!this.props.isCompelete);
    }

    handleDelItem=()=>{
        this.props.delItem(parseInt(this.props.index));
    }

    render(){
        return(
            <li className="list-group-item">
                <div className="custom-control custom-checkbox mr-sm-2 inlineBlock">
                    <input type="checkbox" className="custom-control-input" id={"ListGroupItem"+this.props.index} onChange={this.handleItemCompelete} checked={this.props.isCompelete}></input>
                    <label className="custom-control-label" htmlFor={"ListGroupItem"+this.props.index} style={this.props.isCompelete?{textDecoration:'line-through'}:{textDecoration:'none'}}>{this.props.content}</label>
                </div>
                <button type="button" className="close noneOutline" data-toggle="modal" data-target="#confirmModalCenter" onClick={this.handleDelItem}>&times;</button>
            </li>
        );
    }
}

class ContentModal extends React.Component{

    renderAddEvent=()=>{
        let inputNode = document.getElementById('inputContent')
        this.props.handleAddEvent(inputNode.value);
        inputNode.value='';
    }

    render(){
        return(
            <div className="modal fade" id="contentModalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalCenterTitle">Please enter content</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="inputContent">Content</label>
                                <input type="text" className="form-control" id="inputContent" placeholder="Enter Content"></input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.renderAddEvent}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ConfirmModal extends React.Component{

    renderDelEvent = ()=>{
        this.props.handleDelEvent();
    }

    render(){
        return (
            <div className="modal fade" id="confirmModalCenter" tabIndex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalCenterTitle">Confirm</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Are you sure to delete ALL/YOUR SELECTION content(s)?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.renderDelEvent}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDom.render(<App/>,document.getElementById('root'));