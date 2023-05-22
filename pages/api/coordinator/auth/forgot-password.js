import axios from 'axios';

export default async function forgotPassword(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/forgot-password`;

		const { email } = req.body;

		const { data } = await axios.post(backendURL, {
			email,
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
