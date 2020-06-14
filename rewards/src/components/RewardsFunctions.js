const uniqueId = require('lodash.uniqueid');

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const moveFromCategories = (source, destination, droppableSource, droppableDestination) => {
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


export const moveFromRewards = (source, destination, droppableSource, droppableDestination) => {
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

export const checkContains = (destinationArray, Value) => {
    for (var i = 0; i < destinationArray.length; i++) {
        if (destinationArray[i].content === Value.content) {
            return true;
        }
    }
    return false;
}
const grid = 8;

export const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: "10px",
    background: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle,
    width: "100%",
    maxWidth: "100px"
});

export const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    borderRadius: "10px",
    padding: grid,
    width: "100%",
    height: "400px",
    textAlign: "center"
});

export const deleteReward = (Category, index) => {
    const sourceClone = Array.from(Category);
    sourceClone.splice(index, 1);
    return sourceClone;
};