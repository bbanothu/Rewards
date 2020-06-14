export const saveState = (newState) => {
    return {
        type: "UPDATE_STATE",
        value: newState,
    }
}

export default saveState