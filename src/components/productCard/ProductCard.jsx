//Product card for showing product details

import {Card, CardActions, CardContent, CardMedia} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {Delete, Edit} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import "./productCard.css";

const ProductCard = ({mode, deleteProduct, modifyProduct, buyProduct, ...details}) => {

	let truncateText = (text) => {
		if(150 > text.length) {
			return text;
		}
		return text.substring(0, 150) + "...";
	};

	let checkAdminMode = () => {
		if(mode === "EDIT") {
			return (
				<>
					<Grid item xs={2}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<IconButton
								aria-label="Modify"
								onClick={() => modifyProduct(details)}
							>
								<Edit />
							</IconButton>
						</div>
					</Grid>
					<Grid item xs={2}>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<IconButton
								aria-label="Delete"
								onClick={() => deleteProduct(details)}
							>
								<Delete />
							</IconButton>
						</div>
					</Grid>
				</>
			);
		} else {
			return <></>;
		}
	};

	return (
		<Card style={{height: "400px", width: "345px"}}>
			<CardMedia sx={{height: "200px", display: "flex", justifyContent: "center"}}>
				<img
					src={details.imageUrl}
					alt={"Image of " + details.name}
					style={{
						maxWidth: "150px",
						width: "100%",
						height: "200px",
					}}
				/>
 			</CardMedia>
			<CardContent>
				<Grid container>
					<Grid item xs={9}>
						<div style={{display: 'flex', justifyContent: 'left'}}>
							<Typography gutterBottom variant="h6" component="div" className="wrap_text" title={details.name}>
								{details.name}
							</Typography>
						</div>
					</Grid>
					<Grid item xs={3}>
						<div style={{display: 'flex', justifyContent: 'right'}}>
							<Typography gutterBottom variant="h6" component="div" className="wrap_text" title={'\u20B9 ' + details.price}>
								{'\u20B9 ' + details.price}
							</Typography>
						</div>
					</Grid>
				</Grid>
				<Typography variant="body2" color="text.secondary" sx={{height: 80}}>
					{truncateText(details.description)}
				</Typography>
			</CardContent>
			<CardActions>
				<Grid container>
					<Grid item xs={8}>
						<div style={{display: 'flex', justifyContent: 'left'}}>
							<Button
									variant="contained"
									color="primary"
									onClick={() => buyProduct(details)}
							>
								BUY
							</Button>
						</div>
					</Grid>
					{checkAdminMode()}
				</Grid>
			</CardActions>
		</Card>
	);
};

export default ProductCard;