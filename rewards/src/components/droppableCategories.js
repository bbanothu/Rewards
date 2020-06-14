import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { getItemStyle, getListStyle, deleteReward } from './RewardsFunctions'

// Class for Categories
class droppableCategories extends Component {
  render() {
    return (
      <div
        ref={this.props.provided.innerRef}
        style={getListStyle(this.props.snapshot.isDraggingOver)}>
        {this.props.Category.map((item, index) => (
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
                    const tempValue = deleteReward(this.props.Category, index);
                    this.props.updateRewards([this.props.categoryName], tempValue);
                  }}
                ><span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
          </Draggable>
        ))}
        {this.props.provided.placeholder}
      </div>

    );
  }
}

export default droppableCategories;