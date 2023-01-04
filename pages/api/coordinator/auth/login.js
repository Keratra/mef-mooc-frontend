import axios from 'axios';
import { saveCookie } from 'lib';

export default async function login(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/login`;

		const { email, password } = req.body;

		const { data } = await axios.post(backendURL, {
			email,
			password,
		});

		saveCookie({
			key: 'token',
			value: data.access_token,
			req,
			res,
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
