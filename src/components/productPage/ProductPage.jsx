//Component for product creation and modification

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {useCallback, useContext, useEffect, useState} from "react";
import useAuthentication from "../../hooks/useAuthentication";
import {useLocation, useNavigate} from "react-router-dom";
import {initCatalog} from "../../store/actions/metadataAction";
import {connect} from "react-redux";
import useServices from "../../hooks/useServices";
import CreatableSelect from "../creatableSelect/CreatableSelect";

const ProductPage = ({categories, mode, headingText, buttonText, callbackFunction, jsonData, reFetchAllData}) => {

	jsonData = jsonData || {
		id: "",
		name: "",
		category: "",
		manufacturer: "",
		availableItems: "",
		price: "",
		imageUrl: "",
		description: "",
	};
	const [busy, setBusy] = useState(false);
	const {ServicesCtx} = useServices();
	const {broadcastMessage} = useContext(ServicesCtx);
	const {AuthCtx} = useAuthentication();
	const {accessToken, isAccessTokenValid, logout} = useContext(AuthCtx);
	const navigate = useNavigate();
	const location = useLocation();
	let json = location.state;
	if(mode === undefined || mode === null) {
		json = null;
	} else if(mode === "MODIFY") {
		if(json === null || json === undefined) {
			json = null;
		} else {
			json = JSON.parse(json).value;
			if(json === null || json === undefined || json["id"] === undefined || json.id === null) {
				json = null;
			}
		}
	}
	jsonData = json || {
		id: "",
		name: "",
		category: "",
		manufacturer: "",
		availableItems: "",
		price: "",
		imageUrl: "",
		description: "",
	};
	const initPageData = useCallback((type = mode, data = json, redirect = navigate, showMessage = broadcastMessage) => {
		if(type === null || (type === "MODIFY" && data === null)) {
			showMessage("Invalid access. Redirecting to home...", "warning");
			redirect("/home");
		}
	}, [mode, json, navigate, broadcastMessage]);
	useEffect(() => {
		initPageData();
	}, [initPageData]);

	let initialState = {
		name: {
			value: jsonData.name,
			error: false,
			errorMessage: null,
		},
		category: {
			value: jsonData.category,
			error: false,
			errorMessage: null,
		},
		manufacturer: {
			value: jsonData.manufacturer,
			error: false,
			errorMessage: null,
		},
		availableItems: {
			value: jsonData.availableItems,
			error: false,
			errorMessage: null,
		},
		price: {
			value: jsonData.price,
			error: false,
			errorMessage: null,
		},
		imageUrl: {
			value: jsonData.imageUrl,
			error: false,
			errorMessage: null,
		},
		description: {
			value: jsonData.description,
			error: false,
			errorMessage: null,
		},
	};

	const [formData, setFormData] = useState(initialState);

	let validateData = () => {
		setBusy(true);
		let data = {
			...formData
		};
		let requestJson = {};
		if(jsonData.hasOwnProperty("id") && jsonData.id.length > 0) {
			requestJson["id"] = jsonData.id;
		}
		let valid = true;
		for(let k in formData) {
			let json = getValidity(k, formData[k].value);
			data[k] = {
				value: data[k].value,
				error: !json.valid,
				errorMessage: json.message,
			};
			valid = valid && json.valid;
			if(json.valid) {
				requestJson[k] = data[k].value;
			}
		}
		setFormData(data);
		if(valid) {
			if(isAccessTokenValid()) {
				callbackFunction(requestJson, accessToken).then(json => {
					broadcastMessage(json.message, "success");
					setBusy(false);
					reFetchAllData(accessToken);
					navigate("/home");
				}).catch(json => {
					broadcastMessage(json.reason, "error");
					setBusy(false);
				});
			} else {
				broadcastMessage("Session expired. Please login again!", "info");
				logout().then(() => {
					navigate("/login");
				});
			}
		} else {
			setBusy(false);
		}
	};

	let matchRegex = (value, re) => {
		let regex = new RegExp(re);
		return regex.test(value);
	}

	let getValidity = (field, value) => {
		let valid = true;
		let message = null;
		if(value == null || value.length === 0) {
			if(field !== "imageUrl" && field !== "description") {
				valid = false;
				message = "This field is required.";
			}
		} else {
			switch (field) {
				case "name": {
					if(value.length > 255) {
						valid = false;
						message = "Product name can be of length 255 characters";
					} else {
						valid = matchRegex(value, "^([A-Za-z\\s]+)$");
						message = "Please enter valid product name.";
					}
					break;
				}
				case "category": {
					if(value.length > 255) {
						valid = false;
						message = "Category can be of length 255 characters";
					} else {
						valid = matchRegex(value, "^([A-Za-z-\\s]+)$");
						message = "Please enter valid category.";
					}
					break;
				}
				case "manufacturer": {
					if(value.length > 255) {
						valid = false;
						message = "Manufacturer can be of length 255 characters";
					} else {
						valid = matchRegex(value, "^([A-Za-z\\s]+)$");
						message = "Please enter valid manufacturer.";
					}
					break;
				}
				case "availableItems": {
					valid = matchRegex(value, "^([1-9]{1}[0-9]{0,8})$");
					message = "Please enter valid number.";
					break;
				}
				case "price": {
					valid = matchRegex(value, "^([1-9]{1}[0-9]{0,8})$");
					message = "Please enter valid amount.";
					break;
				}
				case "imageUrl": {
					try {
						valid = Boolean(new URL(value));
						if(!valid) {
							message = "Please enter valid url.";
						}
					} catch(e){
						valid = false;
						message = "Please enter valid url.";
					}
					break;
				}
				case "description": {
					if(value.length > 255) {
						valid = false;
						message = "Description can be of length 255 characters";
					} else {
						valid = matchRegex(value, "^([A-Za-z0-9_@%*.-\\s\\[\\]\\,\\(\\)\\']{1,255})$");
						message = "Please enter valid description.";
					}
					break;
				}
				default : {
					return;
				}
			}
		}
		return {
			valid,
			message
		};
	};

	let validateAndSave = (field, value) => {
		let json = getValidity(field, value);
		let data = {
			...formData
		};
		data[field] = {
			value: value,
			error: !json.valid,
			errorMessage: json.message,
		}
		setFormData(data);
	};

	let saveOnChange = (field, value) => {
		setFormData({
			...formData,
			[field]:{
				...formData[field],
				value
			}
		});
	};

	let onChangeCallback = (value) => {
		validateAndSave("category", value)
	};

	return (
		<Box sx={{flexGrow: 1}}>
			<Grid container spacing={1}>
				<Grid container item spacing={3}>
					<Grid item xs={4}/>
					<Grid item xs={4}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Typography
								variant="subtitle1"
								noWrap
								sx={{
									fontSize: "25px",
									color: 'inherit',
								}}
							>
								{headingText}
							</Typography>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="productName"
								label="Name *"
								variant="outlined"
								fullWidth
								value={formData.name.value}
								onChange={(event) => saveOnChange("name", event.target.value)}
								onBlur={(event) => validateAndSave("name", event.target.value)}
								error={formData.name.error}
								helperText={formData.name.error && formData.name.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<CreatableSelect
								id="category"
								label="Category *"
								variant="outlined"
								fullWidth
								value={formData.category.value}
								onChange={onChangeCallback}
								onBlur={onChangeCallback}
								error={formData.category.error}
								helperText={formData.category.error && formData.category.errorMessage}
								options={categories}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="manufacturer"
								label="Manufacturer *"
								variant="outlined"
								fullWidth
								value={formData.manufacturer.value}
								onChange={(event) => saveOnChange("manufacturer", event.target.value)}
								onBlur={(event) => validateAndSave("manufacturer", event.target.value)}
								error={formData.manufacturer.error}
								helperText={formData.manufacturer.error && formData.manufacturer.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="availableItems"
								label="Available Items *"
								variant="outlined"
								fullWidth
								value={formData.availableItems.value}
								onChange={(event) => saveOnChange("availableItems", event.target.value)}
								onBlur={(event) => validateAndSave("availableItems", event.target.value)}
								error={formData.availableItems.error}
								helperText={formData.availableItems.error && formData.availableItems.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="price"
								label="Price *"
								variant="outlined"
								fullWidth
								value={formData.price.value}
								onChange={(event) => saveOnChange("price", event.target.value)}
								onBlur={(event) => validateAndSave("price", event.target.value)}
								error={formData.price.error}
								helperText={formData.price.error && formData.price.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="imageUrl"
								label="Image URL"
								variant="outlined"
								fullWidth
								value={formData.imageUrl.value}
								onChange={(event) => saveOnChange("imageUrl", event.target.value)}
								onBlur={(event) => validateAndSave("imageUrl", event.target.value)}
								error={formData.imageUrl.error}
								helperText={formData.imageUrl.error && formData.imageUrl.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<TextField
								id="description"
								label="Product Description"
								variant="outlined"
								fullWidth
								value={formData.description.value}
								onChange={(event) => saveOnChange("description", event.target.value)}
								onBlur={(event) => validateAndSave("description", event.target.value)}
								error={formData.description.error}
								helperText={formData.description.error && formData.description.errorMessage}
							/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "30px"}}>
							<Button
								variant="contained"
								color="primary"
								fullWidth
								onClick={validateData}
							>
								{buttonText}
							</Button>
						</div>
					</Grid>
					<Grid item xs={4}/>
				</Grid>
			</Grid>
			<Backdrop
				sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
				open={busy}
			>
				<CircularProgress color="inherit"/>
			</Backdrop>
		</Box>
	);
};

const mapStateToProps = (state) => {
	return {
		productList: state.metadata.products,
		sortBy: state.metadata.selectedSortBy,
		category: state.metadata.selectedCategory,
		categories: state.metadata.categories,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		reFetchAllData: (accessToken) => dispatch(initCatalog(accessToken)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage);