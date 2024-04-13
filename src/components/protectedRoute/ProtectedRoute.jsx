//Protected Component for restricting access

import useAuthentication from "../../hooks/useAuthentication";
import {useContext} from "react";
import Login from "../login/Login";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
	const {AuthCtx} = useAuthentication();
	const {loggedInUser, hasRole} = useContext(AuthCtx);
	let page = <Login />;
	if(loggedInUser !== null) {
		if(hasRole(role)) {
			page = children;
		} else {
			page = <Navigate to={"/home"} />;
		}
	}
	return page;
};

export default ProtectedRoute;