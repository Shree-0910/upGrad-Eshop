//Logout button component

import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import {useContext} from "react";
import {clearAllMetadata} from "../../store/actions/metadataAction";
import {connect} from "react-redux";

const Logout = ({sx, resetMetadata}) => {

	const {AuthCtx} = useAuthentication();
	const {logout} = useContext(AuthCtx);

	if(sx === null || sx === undefined) {
		sx = {};
	}
	const navigate = useNavigate();

	let performLogout = () => {
		resetMetadata();
		logout().then(() => {
			navigate("/login");
		});
	}

	return (
		<Button sx={sx}
				variant="contained"
				color="secondary"
				onClick={() => performLogout()}>
			LOGOUT
		</Button>
	);
};

const mapStateToProps = (state) => {
	return {
		sortBy: state.metadata.selectedSortBy,
		category: state.metadata.selectedCategory,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		resetMetadata: () => dispatch(clearAllMetadata()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);