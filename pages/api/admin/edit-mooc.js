import axios from 'axios';

export default async function editMOOC(req, res) {
	try {
		const { id, name, url, average_hours } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/mooc/${id}/update`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				name,
				url,
				average_hours,
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
