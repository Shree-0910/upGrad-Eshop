//Error Page when user tries to access invalid url

import Grid from "@mui/material/Grid";
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ErrorPage = () => {
	return (
		<Box sx={{flexGrow: 1}}>
			<Grid container spacing={1}>
				<Grid container item spacing={3}>
					<Grid item xs={4}/>
					<Grid item xs={4}>
						<div style={{display: 'flex', justifyContent: 'center', marginTop: "10%"}}>
							<LocationOffOutlinedIcon style={{
								display: 'inline-block',
								borderRadius: '60px',
								padding: '0.6em 0.6em',
								color: '#ffffff',
								background: "#f50057"
							}}/>
						</div>
						<div style={{display: 'flex', justifyContent: 'center'}}>
							<Typography
								variant="subtitle1"
								noWrap
								sx={{
									fontSize: "25px",
									color: 'inherit',
								}}
							>
								404 Not Found
							</Typography>
						</div>
					</Grid>
					<Grid item xs={4}/>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ErrorPage;