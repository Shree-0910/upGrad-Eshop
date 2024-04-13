import metadataReducer from "./metadataReducer";
import {combineReducers} from "redux";

export default combineReducers({
	metadata: metadataReducer,
});