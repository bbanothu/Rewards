import { createStore } from 'redux';
import actions from '../actions/saveState'
import reducer from '../reducers/initStore'
let myStorage = window.localStorage;
// Creating the default store values
var uniqueId = require('lodash.uniqueid');
let State = [];
let rewardsArray = [];
let C1 = [];
let C2 = [];
let C3 = [];
let C4 = [];
let C5 = [];
rewardsArray.push({ id: uniqueId(`R-1`), content: `R1` });
rewardsArray.push({ id: uniqueId(`R-2`), content: `R2` });
rewardsArray.push({ id: uniqueId(`R-3`), content: `R3` });
rewardsArray.push({ id: uniqueId(`R-4`), content: `R4` });
rewardsArray.push({ id: uniqueId(`R-5`), content: `R5` });
State.push(rewardsArray);
State.push(C1);
State.push(C2);
State.push(C3);
State.push(C4);
State.push(C5);


const store = createStore(reducer)
// Reads from local Storage if a save has already been made
var myState = localStorage.getItem('myState');
console.log(myState)
if (myState === null) {
    store.dispatch(actions(State))
} else {
    store.dispatch(actions(JSON.parse(window.localStorage.getItem('myState'))));
}

export default store;