import axios from 'axios';

export default async function createBundle(req, res) {
	try {
		const { course_id, mooc_ids } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/enrollments/${course_id}/create-bundle`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				mooc_ids,
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
