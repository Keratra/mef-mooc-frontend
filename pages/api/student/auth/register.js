import axios from 'axios';

export default async function register(req, res) {
	try {
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/student/register`;

		const { student_no, name, surname, email, password, department_id } =
			req.body;

		const { data } = await axios.post(backendURL, {
			student_no,
			name,
			surname,
			email,
			password,
			department_id,
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
