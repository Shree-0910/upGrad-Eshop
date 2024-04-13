//Static footer visible on all pages on bottom

import "./Footer.css";
import Typography from '@mui/material/Typography';
const Footer = () => (
	<footer className="footer">
		<div style={{display: 'flex', justifyContent: 'center'}}>
			<Typography variant="body2">Copyright © <a href="https://www.upgrad.com/" target="blank">upGrad</a> 2023.</Typography>
		</div>
	</footer>
);

export default Footer;