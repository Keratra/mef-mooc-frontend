import axios from 'axios';

export default async function addCoordinator(req, res) {
	try {
		const { students } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/invite-students`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				students,
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
