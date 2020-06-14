import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect, useDispatch } from "react-redux";
import actions from '../actions/saveState'
import store from '../store/myStore'
import DroppableRewards from './droppableRewards'
import DroppableCategories from './droppableCategories'
import {
  reorder,
  moveFromCategories,
  moveFromRewards,
  getItemStyle,
  getListStyle,
  deleteReward
}
  from './RewardsFunctions'

// a little function to help us with reordering the result


class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: 1,
      history: [this.props.myState],
      Rewards: this.props.myState[0],
      C1: this.props.myState[1],
      C2: this.props.myState[2],
      C3: this.props.myState[3],
      C4: this.props.myState[4],
      C5: this.props.myState[5],
    };
    this.saveState = this.saveState.bind(this);
    this.undoState = this.undoState.bind(this);
  }

  // Used for child components
  updateRewards = (categoryName, value) => {
    this.setState({
      [categoryName]: value
    }, this.updateHistory);
  }
  // Used to update redux store
  saveState = () => {
    let temp = [];
    temp.push(this.state.Rewards);
    temp.push(this.state.C1);
    temp.push(this.state.C2);
    temp.push(this.state.C3);
    temp.push(this.state.C4);
    temp.push(this.state.C5);
    console.log(store.getState());
    // I know this is an anti-pattern - temporary fix
    store.dispatch(actions(temp));
    console.log(store.getState());
  };

  // Used to undo state
  undoState = () => {
    let tempLocation = this.state.location;
    if (tempLocation > 0) {
      tempLocation--;
      let previousState = this.state.history[tempLocation];
      this.setState({

        Rewards: previousState[0],
        C1: previousState[1],
        C2: previousState[2],
        C3: previousState[3],
        C4: previousState[4],
        C5: previousState[5],
        location: tempLocation
      })
    }
  };

  // Used to redo state
  redoState = () => {
    let tempLocation = this.state.location;
    if (tempLocation < this.state.history.length - 1) {
      tempLocation++;
      let nextState = this.state.history[tempLocation];
      this.setState({

        Rewards: nextState[0],
        C1: nextState[1],
        C2: nextState[2],
        C3: nextState[3],
        C4: nextState[4],
        C5: nextState[5],
        location: tempLocation
      })
    }
  };

  // Used for undo and redo to properly keep track of state
  updateHistory = () => {
    if (this.state.location < this.state.history.length - 1) {
      let tempLocation = this.state.location;
      let totalHistory = this.state.history.splice(0, tempLocation);
      let historyVal = []
      historyVal.push(this.state.Rewards);
      historyVal.push(this.state.C1);
      historyVal.push(this.state.C2);
      historyVal.push(this.state.C3);
      historyVal.push(this.state.C4);
      historyVal.push(this.state.C5);
      totalHistory.push(historyVal);
      tempLocation++;
      this.setState({
        history: totalHistory,
        location: tempLocation
      })
    } else {
      let tempLocation = this.state.location;
      let totalHistory = this.state.history;
      let historyVal = []
      historyVal.push(this.state.Rewards);
      historyVal.push(this.state.C1);
      historyVal.push(this.state.C2);
      historyVal.push(this.state.C3);
      historyVal.push(this.state.C4);
      historyVal.push(this.state.C5);
      totalHistory.push(historyVal);
      tempLocation++;
      this.setState({
        history: totalHistory,
        location: tempLocation
      })
    }
  };

  // Helper funtion to get the correct state
  getList = id => this.state[this.id2List[id]];

  // Helper Array to be used for getList
  id2List = {
    Rewards: 'Rewards',
    C1: 'C1',
    C2: 'C2',
    C3: 'C3',
    C4: 'C4',
    C5: 'C5',
  };

  // Used for the core dragging feature
  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    // for reordering
    if (source.droppableId === destination.droppableId) {
      console.log(this.getList(source.droppableId))
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index,
      );
      let state = { items };
      state = { [source.droppableId]: items };
      this.setState(state);
    } else {
      if (source.droppableId === 'Rewards') {
        const result = moveFromRewards(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );
        this.setState({
          [result[0][0]]: result[0][1]
        }, this.updateHistory);
      } else {
        const result = moveFromCategories(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );
        this.setState({
          [result[0][0]]: result[0][1],
          [result[1][0]]: result[1][1],
        }, this.updateHistory);
      }
    }
  };

  render() {
    return (
      <div className="container">
        <div className="shadow  bg-grey rounded mt-4 p-3 mb-5 ">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row">
              <div className="col-sm-2">
                <h3 style={{ textAlign: "center" }}> Rewards </h3>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> Types </p>
                    <Droppable droppableId="Rewards">
                      {(provided, snapshot) => (
                        <DroppableRewards Rewards={this.state.Rewards} provided={provided} snapshot={snapshot} />
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
              <div className="col-sm-10">
                <h3 style={{ textAlign: "center" }}> Categories </h3>
                <hr />
                <div className="row">
                  {/* <div className="col-sm-1"></div> */}
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C1 </p>
                    <Droppable droppableId="C1" >
                      {(provided, snapshot) => (
                        <DroppableCategories Category={this.state.C1} categoryName={"C1"} provided={provided} snapshot={snapshot}
                          updateRewards={this.updateRewards} />
                      )}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C2 </p>
                    <Droppable droppableId="C2">
                      {(provided, snapshot) => (
                        <DroppableCategories Category={this.state.C2} categoryName={"C2"} provided={provided} snapshot={snapshot}
                          updateRewards={this.updateRewards} />)}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C3 </p>
                    <Droppable droppableId="C3">
                      {(provided, snapshot) => (
                        <DroppableCategories Category={this.state.C3} categoryName={"C3"} provided={provided} snapshot={snapshot}
                          updateRewards={this.updateRewards} />)}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C4 </p>
                    <Droppable droppableId="C4">
                      {(provided, snapshot) => (
                        <DroppableCategories Category={this.state.C4} categoryName={"C4"} provided={provided} snapshot={snapshot}
                          updateRewards={this.updateRewards} />)}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C5 </p>
                    <Droppable droppableId="C5">
                      {(provided, snapshot) => (
                        <DroppableCategories Category={this.state.C5} categoryName={"C5"} provided={provided} snapshot={snapshot}
                          updateRewards={this.updateRewards} />)}
                    </Droppable>
                  </div>
                  {/* <div className="col-sm-1"></div> */}
                </div>
              </div>
            </div>
          </DragDropContext >
        </div>
        <div className="row" style={{ float: "right" }}>
          <button
            type="button"
            onClick={this.saveState}
          ><i className="fa fa-save"></i></button>
          <button
            type="button"
            onClick={this.undoState}
          ><i className="fa fa-undo"></i></button>
          <button
            type="button"
            onClick={this.redoState}
          ><i className="fa fa-repeat"></i></button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myState: state,
  };
}

export default (connect(mapStateToProps)(Rewards));