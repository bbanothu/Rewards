import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getItemStyle, getListStyle } from './RewardsFunctions'

// Class for Rewards
class droppableRewards extends Component {
  render() {
    return (
      <div
        ref={this.props.provided.innerRef}
        style={getListStyle(this.props.snapshot.isDraggingOver)}>
        {this.props.Rewards.map((item, index) => (
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
        {this.props.provided.placeholder}
      </div>

    );
  }
}



export default droppableRewards;