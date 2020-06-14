import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from "react-redux";
var uniqueId = require('lodash.uniqueid');

// fake data generator
const getItems = () => {
  const returnArray = [];
  returnArray.push({ id: uniqueId(`R-1`), content: `R1` });
  returnArray.push({ id: uniqueId(`R-2`), content: `R2` });
  returnArray.push({ id: uniqueId(`R-3`), content: `R3` });
  returnArray.push({ id: uniqueId(`R-4`), content: `R4` });
  returnArray.push({ id: uniqueId(`R-5`), content: `R5` });
  return returnArray;

};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
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
    if (destinationArray[i].content == Value.content) {
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
  width: "80px"
});

const modify = (Category, index) => {
  const sourceClone = Array.from(Category);
  sourceClone.splice(index, 1);
  return sourceClone;

};
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  borderRadius: "10px",
  padding: grid,
  width: "110px",
  height: "400px"
});

class Rewards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Rewards: getItems(),
      C1: [],
      C2: [],
      C3: [],
      C4: [],
      C5: [],
    };
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    Rewards: 'Rewards',
    C1: 'C1',
    C2: 'C2',
    C3: 'C3',
    C4: 'C4',
    C5: 'C5',
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
      if (source.droppableId == 'Rewards') {
        const result = moveFromRewards(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );
        this.setState({
          [result[0][0]]: result[0][1]
        });
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
        });
      }
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { myState } = this.props;
    return (
      <div className="container">
        <div className="shadow  bg-grey rounded mt-4 p-3 mb-5 ">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="row">
              <div className="col-sm-2">
                <h2> Rewards </h2>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    <h3> Types </h3>
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
                <h2> Categories </h2>
                <hr />
                <div className="row">
                  <div className="col-sm-2">
                    <h2> C1 </h2>
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
                                      const tempValue = modify(this.state.C1, index);
                                      this.setState({
                                        C1: tempValue
                                      });
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
                    <h2> C2 </h2>
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
                                      const tempValue = modify(this.state.C2, index);
                                      this.setState({
                                        C2: tempValue
                                      });
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
                    <h2> C3 </h2>
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
                                      const tempValue = modify(this.state.C3, index);
                                      this.setState({
                                        C3: tempValue
                                      });
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
                    <h2> C4 </h2>
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
                                      const tempValue = modify(this.state.C4, index);
                                      this.setState({
                                        C4: tempValue
                                      });
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
                    <h2> C5 </h2>
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
                                      const tempValue = modify(this.state.C5, index);
                                      this.setState({
                                        C5: tempValue
                                      });
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
                </div>
              </div>
            </div>
          </DragDropContext >
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
// Put the thing into the DOM!
export default (connect(mapStateToProps)(Rewards));