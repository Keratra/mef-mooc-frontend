import NextLink from 'next/link';
import { useState } from 'react';
import { Formik } from 'formik';
import { registerBayiModel } from 'lib/yupmodels';
import axios from 'axios';
import { useRouter } from 'next/router';

const classInput = 'bg-neutral-50 rounded-b-lg';

export default function Register({ brands }) {
  const Router = useRouter();

  const handleRegister = async (
    { admin_id, name, address, city, country, phone, email, password },
    { setSubmitting }
  ) => {
    try {
      const { data } = await axios.post('/api/auth/dealer/register', {
        admin_id,
        name,
        address,
        city,
        country,
        phone,
        email,
        password,
      });

      Router.replace('/dealer/login');
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message?.message ??
          error?.response?.data?.message ??
          error?.message
      );
      // notify(
      //   'error',
      //   error?.response?.data?.message?.message ??
      //     error?.response?.data?.message ??
      //     error?.message
      // );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Card
        className={`max-w-md md:max-w-2xl mx-auto my-24 py-6 md:px-6 shadow-lg hover:shadow-2xl hover:scale-[101%] transition-transform rounded-3xl`}
      >
        <Formik
          initialValues={registerBayiModel.initials}
          validationSchema={registerBayiModel.schema}
          onSubmit={handleRegister}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 content-center place-content-center px-4`}
            >
              <Typography
                variant='h4'
                className={`md:col-span-2 font-semibold text-center`}
              >
                Bayi Kayıt
              </Typography>

              <TextField
                id='email'
                name='email'
                label='Email'
                placeholder='Emailinizi giriniz...'
                className={'md:col-span-2 ' + classInput}
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <FormControl fullWidth>
                <InputLabel id={'admin_id_label'} className={``}>
                  Marka
                </InputLabel>
                <Select
                  id='admin_id'
                  name='admin_id'
                  label='Marka'
                  labelId='admin_id_label'
                  className='bg-neutral-50'
                  fullWidth
                  value={values.admin_id}
                  onChange={handleChange}
                  error={touched.admin_id && Boolean(errors.admin_id)}
                >
                  {brands.map(({ id, brand }) => (
                    <MenuItem key={id} value={id}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                <p className='-my-1 py-2 pl-3 text-xs col-span-2 text-rose-600 bg-neutral-50 rounded-b-lg'>
                  {errors.admin_id && touched.admin_id && errors.admin_id}
                </p>
              </FormControl>

              <TextField
                id='name'
                name='name'
                label='Ad'
                placeholder='Bayi adını giriniz...'
                className={classInput}
                fullWidth
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />

              <TextField
                id='address'
                name='address'
                label='Adres'
                placeholder='Adres giriniz...'
                className={'md:col-span-2 ' + classInput}
                fullWidth
                value={values.address}
                onChange={handleChange}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />

              <TextField
                id='city'
                name='city'
                label='Şehir'
                placeholder='Şehir seçiniz...'
                className={classInput}
                fullWidth
                value={values.city}
                onChange={handleChange}
                error={touched.city && Boolean(errors.city)}
                helperText={touched.city && errors.city}
              />

              <TextField
                id='country'
                name='country'
                label='Ülke'
                placeholder='Ülke seçiniz...'
                className={classInput}
                fullWidth
                value={values.country}
                onChange={handleChange}
                error={touched.country && Boolean(errors.country)}
                helperText={touched.country && errors.country}
              />

              <TextField
                id='phone'
                name='phone'
                label='Telefon Numarası'
                placeholder='Telefon numaranızı giriniz...'
                className={'md:col-span-2 ' + classInput}
                fullWidth
                value={values.phone}
                onChange={handleChange}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />

              <TextField
                id='password'
                name='password'
                label='Şifre'
                type='password'
                placeholder='Şifrenizi giriniz...'
                className={classInput}
                fullWidth
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />

              <TextField
                id='confirmPassword'
                name='confirmPassword'
                label='Tekrar Şifre'
                type='password'
                placeholder='Tekrar Şifrenizi giriniz...'
                fullWidth
                className={classInput}
                value={values.confirmPassword}
                onChange={handleChange}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
              />

              {/* {errors.email && touched.email && errors.email} */}
              {/* {errors.password && touched.password && errors.password} */}
              <Button
                variant='contained'
                color='primary'
                size='large'
                type='submit'
                className={`md:col-span-2 bg-[#212021] hover:bg-gray-600 font-medium text-lg tracking-wider normal-case`}
                disabled={isSubmitting}
              >
                Kaydol
              </Button>

              <Typography
                variant='subtitle1'
                className={`md:col-span-2 place-self-center`}
              >
                Hesabınız var mı?{' '}
                <NextLink href='/dealer/login' passHref>
                  <Link className={`no-underline`}>Giriş yapın!</Link>
                </NextLink>
              </Typography>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const backendURL = `${process.env.NEXT_PUBLIC_API_URL}/dealer/register`;

//   const { data } = await axios.get(backendURL);

//   const { brands } = data;

//   return {
//     props: {
//       brands,
//     },
//   };
// }
