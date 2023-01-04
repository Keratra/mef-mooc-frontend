import axios from 'axios';

export default async function deleteCoordinator(req, res) {
	try {
		const { coordinator_id } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/coordinators/${coordinator_id}/passive`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{},
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
