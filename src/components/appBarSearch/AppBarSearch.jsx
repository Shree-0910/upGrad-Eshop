//Fancy text box for searching products by name after user has logged in

import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import {alpha, FormControl, InputAdornment, OutlinedInput} from "@mui/material";
import {useNavigate, useSearchParams} from "react-router-dom";
const AppBarSearch = () => {

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [searchFor, setSearchFor] = useState(searchParams.get("searchFor") || "");

	let changeVal = (val) => {
		setSearchFor(val);
	}

	let blurVal = (val) => {
		if(val !== null && val.length > 0) {
			navigate("/home?searchFor=" + val);
		} else {
			navigate("/home");
		}
	}

	return (
		<FormControl variant="outlined" style={{width: "33%"}}>
			<OutlinedInput
				id="search"
				value={searchFor}
				onChange={(event) => changeVal(event.target.value)}
				onBlur={(event) => blurVal(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						blurVal(event.target.value);
					}
				}}
				startAdornment={
					<InputAdornment position="start">
						<SearchIcon sx={{color: "#FFFFFF"}}/>
					</InputAdornment>
				}
				aria-describedby="search"
				placeholder={"Search..."}
				inputProps={{
					'aria-label': 'search',
				}}
				size="small"
				sx={{
					color: "#FFFFFF",
					borderRadius: 2,
					backgroundColor: (theme) => alpha(theme.palette.common.white, 0.15),
					'&:hover': {
						backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
					},
					width: "100%"
				}}
			/>
		</FormControl>
	);
};

export default AppBarSearch;