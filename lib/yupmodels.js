import * as Yup from 'yup';

export const loginStudentModel = {
	initials: {
		student_no: '',
		password: '',
	},
	schema: Yup.object().shape({
		student_no: Yup.string().required('Student No is required'),
		password: Yup.string().required('Password is required'),
	}),
};

export const registerStudentModel = {
	initials: {
		student_no: '',
		name: '',
		surname: '',
		email: '',
		password: '',
		confirmPassword: '',
		department_id: '',
	},
	schema: Yup.object().shape({
		student_no: Yup.string().required('Student No is required'),
		name: Yup.string()
			.min(1, 'Minimum 1 characters')
			.max(100, 'Maximum 100 characters')
			.required('Name is required'),
		surname: Yup.string()
			.min(1, 'Minimum 1 characters')
			.max(100, 'Maximum 100 characters')
			.required('Surname is required'),
		email: Yup.string()
			.min(1, 'Minimum 1 characters')
			.max(100, 'Maximum 100 characters')
			.required('Email is required')
			.matches(
				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				'Please enter a valid email'
			),
		password: Yup.string()
			.min(1, 'Minimum 1 characters')
			.max(64, 'Maximum 64 characters')
			.required('Şifre gereklidir'),
		confirmPassword: Yup.string().oneOf(
			[Yup.ref('password'), null],
			'Both passwords must match'
		),
		department_id: Yup.string().required('Department is required'),
	}),
};

export const loginAdminModel = {
	initials: {
		username: '',
		password: '',
	},
	schema: Yup.object().shape({
		username: Yup.string().required('Username is required'),
		password: Yup.string().required('Password is required'),
	}),
};

export const loginCoordinatorModel = {
	initials: {
		email: '',
		password: '',
	},
	schema: Yup.object().shape({
		email: Yup.string().required('Email is required'),
		password: Yup.string().required('Password is required'),
	}),
};

// export const registerBayiModel = {
// 	initials: {
// 		admin_id: '',
// 		name: '',
// 		address: '',
// 		city: '',
// 		country: '',
// 		phone: '',
// 		email: '',
// 		password: '',
// 		confirmPassword: '',
// 	},
// 	schema: Yup.object().shape({
// 		admin_id: Yup.string().required('Admin seçmeniz gerekiyor'),
// 		name: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ad gereklidir'),
// 		address: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Adres gereklidir'),
// 		city: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Şehir gereklidir'),
// 		country: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ülke gereklidir'),
// 		phone: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Telefon numarası gereklidir')
// 			.matches(
// 				/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
// 				'Girdiğiniz numara geçerli değildir (+90 500 000 0000)'
// 			),
// 		email: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Email gereklidir')
// 			.matches(
// 				/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
// 				'Girdiğiniz email geçerli değildir'
// 			),
// 		password: Yup.string()
// 			.min(8, 'Şifre en az 8 karakterden oluşmalıdır')
// 			.max(30, 'Şifre en fazla 30 karakterden oluşmalıdır')
// 			.matches(
// 				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
// 				'Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir'
// 			)
// 			.required('Şifre gereklidir'),
// 		confirmPassword: Yup.string().oneOf(
// 			[Yup.ref('password'), null],
// 			'Şifreler aynı olmalıdır'
// 		),
// 	}),
// };

// export const registerProductModel = {
// 	initials: {
// 		name: '',
// 		category: '',
// 		description: '',
// 		image: '',
// 	},
// 	schema: Yup.object().shape({
// 		name: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ad gereklidir'),
// 		category: Yup.string().required('Kategori gereklidir'),
// 		description: Yup.string()
// 			.max(500, 'Maksimum 500 karakter girebilirsiniz')
// 			.required('Açıklama gereklidir'),
// 		image: Yup.string().required('Resim gereklidir'),
// 	}),
// };

// export const updateImageModel = {
// 	initials: {
// 		image: '',
// 	},
// 	schema: Yup.object().shape({
// 		image: Yup.string().required('Resim gereklidir'),
// 	}),
// };

// export const updateProductModel = {
// 	initials: {
// 		name: '',
// 		category_id: '',
// 		description: '',
// 	},
// 	schema: Yup.object().shape({
// 		name: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ad gereklidir'),
// 		category_id: Yup.number().required('Kategori gereklidir'),
// 		description: Yup.string()
// 			.max(500, 'Maksimum 500 karakter girebilirsiniz')
// 			.required('Açıklama gereklidir'),
// 	}),
// };

// export const orderModel = {
// 	initials: {
// 		description: '',
// 	},
// 	schema: Yup.object().shape({
// 		description: Yup.string()
// 			.max(2000, 'Maksimum 2000 karakter girebilirsiniz')
// 			.required('Açıklama gereklidir'),
// 	}),
// };

// export const paymentModel = {
// 	initials: {
// 		dealer_id: '',
// 		payment_type: '',
// 		amount: '',
// 		description: '',
// 	},
// 	schema: Yup.object().shape({
// 		dealer_id: Yup.number().required('Bayi seçmeniz gerekiyor'),
// 		payment_type: Yup.string().required('Ödeme tipi seçmeniz gerekiyor'),
// 		amount: Yup.number().required('Tutar gereklidir'),
// 		description: Yup.string()
// 			.max(2000, 'Maksimum 2000 karakter girebilirsiniz')
// 			.required('Açıklama gereklidir'),
// 	}),
// };

// export const dealerProfile = {
// 	initials: {
// 		address: '',
// 		city: '',
// 		country: '',
// 		name: '',
// 		phone: '',
// 	},
// 	schema: Yup.object().shape({
// 		address: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Adres gereklidir'),
// 		city: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Şehir gereklidir'),
// 		country: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ülke gereklidir'),
// 		name: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Ad gereklidir'),
// 		phone: Yup.string()
// 			.max(100, 'Maksimum 100 karakter girebilirsiniz')
// 			.required('Telefon numarası gereklidir')
// 			.matches(
// 				/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)$/,
// 				'Girdiğiniz numara geçerli değildir (+90 500 000 0000)'
// 			),
// 	}),
// };

// export const registerAccountModel = {
// 	initials: {
// 		email: '',
// 		phone: '',
// 		password: '',
// 		confirmPassword: '',
// 		name: '',
// 		surname: '',
// 		specialId: '',
// 	},
// 	schema: Yup.object().shape({
// 		email: Yup.string()
// 			.required('Email gereklidir')
// 			.matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Email gereklidir'),
// 		phone: Yup.string().required('Telefon numarası gereklidir'),
// 		password: Yup.string()
// 			.min(8, 'Şifre en az 8 karakterden oluşmalıdır')
// 			.max(30, 'Şifre en fazla 30 karakterden oluşmalıdır')
// 			.matches(
// 				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
// 				'Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir'
// 			)
// 			.required('Şifre gereklidir'),
// 		name: Yup.string().required('Ad gereklidir'),
// 		surname: Yup.string().required('Soyad gereklidir'),
// 		specialId: Yup.string().required('Özel ID gereklidir'),
// 		confirmPassword: Yup.string().oneOf(
// 			[Yup.ref('password'), null],
// 			'Şifreler aynı olmalıdır'
// 		),
// 	}),
// };

// export const changePasswordModel = {
// 	initials: {
// 		old_password: '',
// 		new_password: '',
// 		confirmPassword: '',
// 	},
// 	schema: Yup.object().shape({
// 		old_password: Yup.string().required('Eski şifre gereklidir'),
// 		new_password: Yup.string()
// 			.min(8, 'Şifre en az 8 karakterden oluşmalıdır')
// 			.max(30, 'Şifre en fazla 30 karakterden oluşmalıdır')
// 			.matches(
// 				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
// 				'Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir'
// 			)
// 			.required('Yeni şifre gereklidir'),
// 		confirmPassword: Yup.string().oneOf(
// 			[Yup.ref('new_password'), null],
// 			'Yeni şifreler aynı olmalıdır'
// 		),
// 	}),
// };

// export const forgotPasswordModel = {
// 	initials: {
// 		password: '',
// 		confirmPassword: '',
// 	},
// 	schema: Yup.object().shape({
// 		password: Yup.string()
// 			.min(8, 'Şifre en az 8 karakterden oluşmalıdır')
// 			.max(30, 'Şifre en fazla 30 karakterden oluşmalıdır')
// 			.matches(
// 				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
// 				'Şifre en az bir büyük harf, bir küçük harf ve bir sayı içermelidir'
// 			)
// 			.required('Şifre gereklidir'),
// 		confirmPassword: Yup.string().oneOf(
// 			[Yup.ref('password'), null],
// 			'Şifreler aynı olmalıdır'
// 		),
// 	}),
// };

// export const settingsModel = {
// 	initials: {
// 		oldPassword: '',
// 		newPassword: '',
// 		confirmPassword: '',
// 	},
// 	schema: Yup.object().shape({
// 		oldPassword: Yup.string().required('Old password gereklidir'),
// 		newPassword: Yup.string()
// 			.min(8, 'Password must be at least 8 characters')
// 			.max(30, 'Password must be fewer than 30 characters')
// 			.matches(
// 				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z\.\ !#$%&? "])[a-zA-Z0-9\.\ !#$%&?]{8,30}$/,
// 				'Password must contain at least one lower case letter, one upper case letter and one number'
// 			)
// 			.required('New password gereklidir'),
// 		confirmPassword: Yup.string()
// 			.required('Confirm password gereklidir')
// 			.oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
// 	}),
// };

// export const generalprofileModel = {
//   initials: {
//     name: '',
//     surname: '',
//     phone: '',
//     birth_date: '',
//     city: '',
//     country: '',
//     job_title: '',
//     starting_date: '',
//     summary: '',
//   },
// };

// export const jobexperienceModel = {
// 	initials: {
// 		company: "",
// 		title: "",
// 		sector: "",
// 		start: "",
// 		end: "",
// 		description: "",
// 		location: "",
// 		workCheck: false,
// 		employment_type: employment_type_list[0],
// 	},
// 	schema: Yup.object().shape({
// 		start: Yup.date().when("workCheck", {
// 			is: false,
// 			then: Yup.date().max(
// 				Yup.ref("end"),
// 				"Starting date must be before ending date"
// 			),
// 		}),
// 		end: Yup.date().when("workCheck", {
// 			is: false,
// 			then: Yup.date().min(
// 				Yup.ref("start"),
// 				"Ending date must be after starting date"
// 			),
// 		}),
// 	}),
// };

// export const projectsModel = {
//   initials: {
//     // name: "",
//     description: '',
//     // sector: "",
//     url: '',
//     company: '',
//     // start: "",
//     // end: "",
//     // location: "",
//   },
//   schema: Yup.object().shape({
//     start: Yup.date().max(
//       Yup.ref('end'),
//       'Starting date must be before ending date'
//     ),
//     end: Yup.date().min(
//       Yup.ref('start'),
//       'Ending date must be after starting date'
//     ),
//   }),
// };

// export const languageModel = {
//   initials: {
//     name: '',
//     level: '',
//     certificate: '',
//   },
// };

// export const educationModel = {
//   initials: {
//     school: '',
//     degree: '',
//     department: '',
//     graduation: '',
//     start_date: '',
//   },
//   schema: Yup.object().shape({
//     graduation: Yup.date().min(
//       Yup.ref('start_date'),
//       "Graduation date can't be before start date"
//     ),
//     start_date: Yup.date()
//       .max(Yup.ref('graduation'), "start date can't be after graduation")
//       .required('Start date gereklidir'),
//   }),
// };

// export const certificateModel = {
//   initials: {
//     name: '',
//     organization: '',
//     issue_date: '',
//     expire_date: '',
//     url: '',
//     validForever: false,
//   },
//   schema: Yup.object().shape({
//     issue_date: Yup.date().when('validForever', {
//       is: false,
//       then: Yup.date().max(
//         Yup.ref('expire_date'),
//         "Issue date can't be after expire date"
//       ),
//     }),
//     expire_date: Yup.date().when('validForever', {
//       is: false,
//       then: Yup.date().min(
//         Yup.ref('issue_date'),
//         "Expire date can't be before issue date"
//       ),
//     }),
//   }),
// };

// export const volunteerexperienceModel = {
//   initials: {
//     organization: '',
//     role: '',
//     cause: '',
//     start_date: '',
//     end_date: '',
//     description: '',
//     currently_volunteer: false,
//   },
//   schema: Yup.object().shape({
//     start_date: Yup.date().when('currently_volunteer', {
//       is: false,
//       then: Yup.date().max(
//         Yup.ref('end_date'),
//         "Start date can't be after end date"
//       ),
//     }),
//     end_date: Yup.date().when('start_date', {
//       is: false,
//       then: Yup.date().min(
//         Yup.ref('start_date'),
//         "End date can't be before start date"
//       ),
//     }),
//   }),
// };
