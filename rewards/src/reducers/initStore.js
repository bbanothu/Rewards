let myStorage = window.localStorage;
function initStore(state = [], action) {
    switch (action.type) {
        case 'UPDATE_STATE':
            myStorage.setItem('myState', JSON.stringify(action.value));
            state = action.value;
            return state
        default:
            return state
    }
}

export default initStore;