import axios from 'axios';

export default async function editCertificate(req, res) {
	try {
		const { course_id, bundle_id, bundle_detail_id, certificate_url } =
			req.body;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/coordinator/course/${course_id}/bundle/${bundle_id}/bundle-detail/${bundle_detail_id}/update-certificate`;

		const token = req.cookies.token;

		const { data } = await axios.post(
			backendURL,
			{
				certificate_url,
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
