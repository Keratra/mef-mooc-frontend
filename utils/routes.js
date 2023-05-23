import {
	HiHome,
	HiEye,
	HiUser,
	HiUsers,
	HiTemplate,
	HiTag,
	HiCube,
	HiBriefcase,
	HiViewGrid,
	HiViewGridAdd,
	HiCash,
	HiLightBulb,
	HiDocumentReport,
	HiDocument,
	HiDocumentText,
} from 'react-icons/hi';
import { RiSecurePaymentFill } from 'react-icons/ri';

const size = 26;
const iconClass = `align-text-bottom`;

export const routes = [
	{
		name: 'Courses',
		pathname: '/coordinator/courses',
		icon: <HiViewGrid size={size} className={iconClass} />,
	},
	{
		name: 'Profile',
		pathname: '/coordinator/profile',
		icon: <HiUser size={size} className={iconClass} />,
	},

	{
		name: 'My Courses',
		pathname: '/student/courses',
		icon: <HiTag size={size} className={iconClass} />,
	},
	{
		name: 'MOOC List',
		pathname: '/student/moocs',
		icon: <HiCash size={size} className={iconClass} />,
	},
	{
		name: 'My Profile',
		pathname: '/student/profile',
		icon: <HiUser size={size} className={iconClass} />,
	},

	{
		name: 'Dashboard',
		pathname: '/admin/dashboard',
		icon: <HiTemplate size={size} className={iconClass} />,
	},
	{
		name: 'MOOCs',
		pathname: '/admin/moocs',
		icon: <HiCash size={size} className={iconClass} />,
	},
	{
		name: 'Reports',
		pathname: '/admin/reports',
		icon: <HiDocumentText size={size} className={iconClass} />,
	},
	// {
	// 	name: 'Settings',
	// 	pathname: '/admin/settings',
	// 	icon: <HiUser size={size} className={iconClass} />,
	// },

	// {
	// 	name: 'Dashboard',
	// 	pathname: '/admin',
	// 	icon: <HiBriefcase size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ürünler',
	// 	pathname: '/admin/products',
	// 	icon: <HiTemplate size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Siparişler',
	// 	pathname: '/admin/orders',
	// 	icon: <HiCash size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ödemeler',
	// 	pathname: '/admin/payments',
	// 	icon: <RiSecurePaymentFill size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Gör',
	// 	pathname: '/admin/view',
	// 	icon: <HiEye size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Fiyat İstekleri',
	// 	pathname: '/admin/price-requests',
	// 	icon: <HiTag size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ürün Önerileri',
	// 	pathname: '/admin/product-requests',
	// 	icon: <HiViewGridAdd size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ürünleriniz',
	// 	pathname: '/dealer',
	// 	icon: <HiCube size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Yeni Ürünler',
	// 	pathname: '/dealer/new-products',
	// 	icon: <HiBriefcase size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ürün Önerin',
	// 	pathname: '/dealer/product-offer',
	// 	icon: <HiLightBulb size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Ödemeleriniz',
	// 	pathname: '/dealer/payments',
	// 	icon: <RiSecurePaymentFill size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Siparişleriniz',
	// 	pathname: '/dealer/orders',
	// 	icon: <HiCash size={size} className={`align-top`} />,
	// },
	// {
	// 	name: 'Profil',
	// 	pathname: '/dealer/profile',
	// 	icon: <HiUser size={size} className={`align-top`} />,
	// },
];

export const coordinatorPages = ['Courses', 'Profile'];

export const studentPages = ['My Courses', 'MOOC List', 'My Profile'];

export const adminPages = ['Dashboard', 'MOOCs', 'Reports'];

export const ignoredRouteList = [
	'/',
	'/contributors',
	'/student/auth/login',
	'/student/auth/register',
	'/coordinator/auth/login',
	'/coordinator/auth/register',
	'/admin/auth/login',

	// '/student/forgot-password',
	// '/student/confirm-new-password/[token]',
	// '/student/reset-password/[token]',
	// '/employee/forgot-password',
	// '/employee/confirm-new-password/[token]',
	// '/employee/reset-password/[token]',
	// '/forgot',

	'/404',
	'/500',
	'/maintenance',
];
