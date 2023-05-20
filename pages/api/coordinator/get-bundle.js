import axios from 'axios';

export default async function getBundle(req, res) {
	try {
		const { course_id, bundle_id } = req.query;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/bundle/${bundle_id}`;

		const token = req.cookies.token;

		const { data } = await axios.get(backendURL, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(error.response?.status || 500).json({
			message: error.response.data.message || error || 'Something went wrong',
		});
	}
}
