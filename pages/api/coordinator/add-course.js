import axios from 'axios';

export default async function addCourse(req, res) {
	try {
		const { course_code, name, type, semester, credits } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/add-course`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				course_code,
				name,
				type,
				semester,
				credits,
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
