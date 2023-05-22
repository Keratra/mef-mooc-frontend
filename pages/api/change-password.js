import axios from 'axios';

export default async function changePassword(req, res) {
	try {
		const { userType, oldPassword, newPassword } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/${userType}/change-password`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				old_password: oldPassword,
				new_password: newPassword,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
