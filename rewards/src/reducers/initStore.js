function initStore(state = [], action) {
    switch (action.type) {
        case 'UPDATE_STATE':
            state = action.value;
            return state
        default:
            return state
    }
}

export default initStore;