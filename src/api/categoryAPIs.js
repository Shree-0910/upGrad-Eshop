//Rest APIs for category

export const fetchAllCategories = (accessToken) => {
	//Note: we are returning promise so that we can resolve it by using appropriate data type like json or text
	//caller of the function should only be concerned with returned data on success or failure message
	let promiseResolveRef = null;
	let promiseRejectRef = null;
	let promise = new Promise((resolve, reject) => {
		promiseResolveRef = resolve;
		promiseRejectRef = reject;
	});
	fetch('http://localhost:8080/api/products/categories', {
		method: 'GET',
		headers: {
			'x-auth-token': accessToken,
		},
	}).then((response) => {
		response.json().then((json) => {
			//capitalise every category
			//show only unique
			let arr = [];
			for(let i = 0; i < json.length; i++) {
				let c = json[i].toUpperCase();
				if(!arr.includes(c)) {
					arr.push(c);
				}
			}
			arr.sort();
			arr = ["ALL", ...arr];
			if(response.ok) {
				promiseResolveRef({
					data: arr,
					response: response,
				});
			} else {
				promiseRejectRef({
					reason: "Server error occurred.",
					response: response,
				});
			}
		});
	}).catch((err) => {
		promiseRejectRef({
			reason: "Some error occurred.",
			response: err,
		});
	});
	return promise;
};