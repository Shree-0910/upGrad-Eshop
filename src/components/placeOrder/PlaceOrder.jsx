//Order placement sequence

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {Step, StepLabel, Stepper} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import Address from "../address/Address";
import Button from "@mui/material/Button";
import OrderDetails from "../orderDetails/OrderDetails";
import {createOrder} from "../../api/orderAPIs";
import useServices from "../../hooks/useServices";
import ItemDetail from "../itemDetail/ItemDetail";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const PlaceOrder = () => {

	const [showInfo, setShowInfo] = useState(false);
	const [showMessage, setShowMessage] = useState("");
	const [showMessageLevel, setShowMessageLevel] = useState("error");
	const {ServicesCtx} = useServices();
	const {broadcastMessage} = useContext(ServicesCtx);
	const [activeStep, setActiveStep] = useState(0);
	const {AuthCtx} = useAuthentication();
	const {loggedInUserId, accessToken, isAccessTokenValid, logout} = useContext(AuthCtx);
	const navigate = useNavigate();
	const location = useLocation();
	let json = location.state;
	if(json === null || json === undefined) {
		json = null;
	} else {
		json = JSON.parse(json);
		if(json === null || json === undefined ||
		json["product"]["id"] === undefined || json["product"]["id"] === null ||
		json["quantity"] === undefined || json["quantity"] === null) {
			json = null;
		}
	}
	const initPageData = useCallback((data = json, redirect = navigate, showMessage = broadcastMessage) => {
		if(data === null) {
			showMessage("Invalid access. Redirecting to home...", "warning");
			redirect("/home");
		}
	}, [json, navigate, broadcastMessage]);
	useEffect(() => {
		initPageData();
	}, [initPageData]);

	const [orderDetails, setOrderDetails] = useState({
		quantity: (json !== null) ? (json.quantity || null) : null,
		user: loggedInUserId,
		product: (json !== null) ? (json.product.id || null) : null,
		address: null,
		addressObject : null
	});

	let stepperArray = [
		{
			labelOrder: 1,
			label: "Items",
			completed: false,
		},
		{
			labelOrder: 2,
			label: "Select Address",
			completed: false,
		},
		{
			labelOrder: 3,
			label: "Confirm Order",
			completed: false,
		},
	];

	const [stepsForOrdering, setStepsForOrdering] = useState(stepperArray);

	let hideAndResetMessage = () => {
		setShowInfo(false);
		setShowMessage("");
		setShowMessageLevel("error");
	};

	let saveAddressForDelivery = (obj) => {
		setOrderDetails({
			...orderDetails,
			address: (obj !== null) ? obj.id : null,
			addressObject: obj,
		});
	};

	let moveToPreviousStep = () => {
		if(activeStep === 0) {
			navigate("/product/view", {
				state: JSON.stringify({
					value: json.product,
				})
			});
		} else {
			let arr = [];
			for(let i = 0; i < stepsForOrdering.length; i++) {
				if(i === activeStep - 1) {
					arr.push({
						...stepsForOrdering[activeStep - 1],
						completed: false,
					});
				} else {
					arr.push(stepsForOrdering[i]);
				}
			}
			setStepsForOrdering(arr);
			setActiveStep(activeStep - 1);
		}
	};

	let validateAndMoveToNextStep = () => {
		let moveToNext = true;
		if(activeStep === 1) {
			if(orderDetails.address === undefined || orderDetails.address === null) {
				setShowInfo(true);
				setShowMessage("Please select address!");
				setShowMessageLevel("error");
				moveToNext = false;
			}
		}
		if(moveToNext) {
			let arr = [];
			for (let i = 0; i < stepsForOrdering.length; i++) {
				if (i === activeStep) {
					arr.push({
						...stepsForOrdering[activeStep],
						completed: true,
					});
				} else {
					arr.push(stepsForOrdering[i]);
				}
			}
			setStepsForOrdering(arr);
			setActiveStep(activeStep + 1);
		} else {
			setActiveStep(activeStep);
		}
	};

	let confirmAndPlaceOrder = () => {
		if(isAccessTokenValid()) {
			createOrder(orderDetails, accessToken).then(() => {
				broadcastMessage("Order placed successfully!", "success");
				navigate("/home");
			}).catch((json) => {
				broadcastMessage(json.reason, "error");
			});
		} else {
			broadcastMessage("Session expired. Please login again!", "info");
			logout().then(() => {
				navigate("/login");
			});
		}
	};

	return (
		<Box sx={{flexGrow: 1}}>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Stepper 
							activeStep={activeStep}
							sx={{width: "80%"}}
						>
							{
								stepsForOrdering !== null && stepsForOrdering.length > 0 &&
								stepsForOrdering.map((element, index) => {
									return (
										<Step
											key={"step_" + index}
											active={index === activeStep}
											index={index}
											last={(index === 2)}
											completed={element.completed}
										>
											<StepLabel>
												{element.label}
											</StepLabel>
										</Step>
									);
								})
							}
						</Stepper>
					</div>
				</Grid>
				{
					activeStep === 0 &&
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<ItemDetail
								productQuantity={orderDetails.quantity}
								selectedProduct={json.product}
							/>
						</div>
					</Grid>
				}
				{
					activeStep === 1 &&
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Address
								callbackFunction={saveAddressForDelivery}
								address={orderDetails.addressObject}
							/>
						</div>
					</Grid>
				}
				{
					activeStep === 2 &&
					<Grid item xs={12}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<OrderDetails
								quantity={orderDetails.quantity}
								product={json.product}
								address={orderDetails.addressObject}
							/>
						</div>
					</Grid>
				}
				<Grid item xs={12}>
					<div style={{display: 'flex', justifyContent: 'center'}}>
						<Button variant="text"
								color="disabled"
								onClick={() => moveToPreviousStep()}
						>
							BACK
						</Button>
						{
							(activeStep === 0 || activeStep === 1) &&
							<Button variant="contained"
									color="primary"
									onClick={() => validateAndMoveToNextStep()}
									sx={{}}
							>
								NEXT
							</Button>
						}
						{
							activeStep === 2 &&
							<Button variant="contained"
									color="primary"
									onClick={() => confirmAndPlaceOrder()}
							>
								PLACE ORDER
							</Button>
						}
					</div>
				</Grid>
			</Grid>
			<Snackbar
				anchorOrigin={{vertical: "top", horizontal: "right"}}
				open={showInfo}
				autoHideDuration={4000}
				onClose={() => hideAndResetMessage()}
			>
				<Alert onClose={() => hideAndResetMessage()} severity={showMessageLevel} sx={{width: '100%'}}>
					{showMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default PlaceOrder;