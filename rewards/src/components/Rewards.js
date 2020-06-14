import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect, useDispatch } from "react-redux";
import actions from '../actions/saveState'
import store from '../Store/myStore'
const uniqueId = require('lodash.uniqueid');


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const moveFromCategories = (source, destination, droppableSource, droppableDestination) => {
  let returnSource = [];
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  if (checkContains(destClone, removed)) {
    returnSource = Array.from(source)
  } else {
    destClone.splice(droppableDestination.index, 0, removed);
    returnSource = sourceClone;
  }
  const result = [];
  result.push([droppableSource.droppableId, returnSource]);
  result.push([droppableDestination.droppableId, destClone]);
  return result;
};


const moveFromRewards = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  const newItem = { id: uniqueId(removed.id), content: removed.content }
  if (checkContains(destClone, newItem)) {
  } else {
    destClone.splice(droppableDestination.index, 0, newItem);
  }
  const result = [];
  result.push([droppableDestination.droppableId, destClone]);
  return result;
};

const checkContains = (destinationArray, Value) => {
  for (var i = 0; i < destinationArray.length; i++) {
    if (destinationArray[i].content === Value.content) {
      return true;
    }
  }
  return false;
}
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: "10px",
  background: isDragging ? 'lightgreen' : 'white',
  ...draggableStyle,
  width: "100%",
  maxWidth: "100px"
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  borderRadius: "10px",
  padding: grid,
  width: "100%",
  height: "400px",
  textAlign: "center"
});

const deleteReward = (Category, index) => {
  const sourceClone = Array.from(Category);
  sourceClone.splice(index, 1);
  return sourceClone;
};

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

  id2List = {
    Rewards: 'Rewards',
    C1: 'C1',
    C2: 'C2',
    C3: 'C3',
    C4: 'C4',
    C5: 'C5',
  };

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



  // Used for undo and redo
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

  getList = id => this.state[this.id2List[id]];
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
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.Rewards.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
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
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.C1.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={
                                    getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}>
                                  {item.content}
                                  <button
                                    className="close" aria-label="Close"
                                    type="button"
                                    onClick={() => {
                                      const tempValue = deleteReward(this.state.C1, index);
                                      this.setState({
                                        C1: tempValue
                                      }, this.updateHistory);
                                    }}
                                  ><span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C2 </p>
                    <Droppable droppableId="C2">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.C2.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>
                                  {item.content}
                                  <button
                                    className="close" aria-label="Close"
                                    type="button"
                                    onClick={() => {
                                      const tempValue = deleteReward(this.state.C2, index);
                                      this.setState({
                                        C2: tempValue
                                      }, this.updateHistory);
                                    }}
                                  ><span aria-hidden="true">&times;</span>                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C3 </p>
                    <Droppable droppableId="C3">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.C3.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>
                                  {item.content}
                                  <button
                                    className="close" aria-label="Close"
                                    type="button"
                                    onClick={() => {
                                      const tempValue = deleteReward(this.state.C3, index);
                                      this.setState({
                                        C3: tempValue
                                      }, this.updateHistory);
                                    }}
                                  ><span aria-hidden="true">&times;</span>                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C4 </p>
                    <Droppable droppableId="C4">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.C4.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>
                                  {item.content}
                                  <button
                                    className="close" aria-label="Close"
                                    type="button"
                                    onClick={() => {
                                      const tempValue = deleteReward(this.state.C4, index);
                                      this.setState({
                                        C4: tempValue
                                      }, this.updateHistory);
                                    }}
                                  ><span aria-hidden="true">&times;</span>                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                  <div className="col-sm-2">
                    <p style={{ fontWeight: "bold", textAlign: "center" }}> C5 </p>
                    <Droppable droppableId="C5">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}>
                          {this.state.C5.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}>
                                  {item.content}
                                  <button
                                    className="close" aria-label="Close"
                                    type="button"
                                    onClick={() => {
                                      const tempValue = deleteReward(this.state.C5, index);
                                      this.setState({
                                        C5: tempValue
                                      }, this.updateHistory);
                                    }}
                                  ><span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
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