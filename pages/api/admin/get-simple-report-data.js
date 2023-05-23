import axios from 'axios';

export default async function getSimpleReportData(req, res) {
	try {
		const { semester } = req.query;
		const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/admin/semester-report/${semester}`;

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
