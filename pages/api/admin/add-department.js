import axios from 'axios';

export default async function createBundle(req, res) {
	try {
		const { name, coordinator_id } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/add-department`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				name,
				coordinator_id,
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
