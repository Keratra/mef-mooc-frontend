import axios from 'axios';

export default async function enroll(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/enroll`;

		const token = req.cookies.token;

		const { course_id } = req.body;

		const { data } = await axios.post(
			backendURL,
			{
				course_id,
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
