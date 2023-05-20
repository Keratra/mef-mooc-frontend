import axios from 'axios';

export default async function approveEnrollment(req, res) {
	try {
		const { course_id, student_id } = req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/waiting-students/accept`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{ student_id },
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
