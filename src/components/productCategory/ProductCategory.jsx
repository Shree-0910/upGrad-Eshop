//Product category toggle button

import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {clearFilter, setFilter} from "../../store/actions/metadataAction";
import {connect} from "react-redux";
import {useEffect, useState} from "react";

const ProductCategory = ({filter, categories, changeFilter, removeFilter}) => {
	const [filterValue, setFilterValue] = useState(filter || "ALL");

	useEffect((newValue = filterValue, array = categories) => {
		let exists = false;
		for(let i = 0; i < array.length; i++) {
			if(array[i] === newValue) {
				exists = true;
				break;
			}
		}
		if(!exists) {
			clearFilter();
			setFilterValue("ALL");
		}
	}, [filterValue, categories]);
	
	const handleAlignment = (event, newAlignment) => {
		if(newAlignment != null) {
			setFilterValue(newAlignment);
			if (newAlignment === "ALL") {
				removeFilter();
			} else {
				changeFilter(newAlignment);
			}
		}
	};

	return (
		<ToggleButtonGroup
			value={filterValue}
			exclusive
			onChange={handleAlignment}
			aria-label="categories"
		>
			{categories !== null && categories.map((element, index) => {
				return (
					<ToggleButton
						key={"category_" + index}
						value={element}
						aria-label={element}>
						{element.toUpperCase()}
					</ToggleButton>
				);
			})}
		</ToggleButtonGroup>
	);
};

const mapStateToProps = (state) => {
	return {
		filter: state.metadata.selectedCategory,
		categories: state.metadata.categories,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeFilter: (category) => dispatch(setFilter(category)),
		removeFilter: () => dispatch(clearFilter()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategory);