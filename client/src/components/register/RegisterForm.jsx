import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../Iconify';
import { register } from '../../services/auth';
import useResponsive from '../../theme/hooks/useResponsive';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const smUp = useResponsive('up', 'sm');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(' ');

  const [showPassword, setShowPassword] = useState(false);

  // Validation schema with mobile number added
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string(),
    emailId: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password should be 8 characters minimum'),
    mobileNumber: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
      mobileNumber: '',
      remember: true,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      // Pass form values to register service
      await register(values, setShowAlert, setAlertMessage);
    },
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    getFieldProps,
  } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      {!smUp && (
        <Snackbar open={showAlert} autoHideDuration={6000}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      )}

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {smUp && showAlert && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            )}

            {/* First and Last Name */}
            <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-between">
              <TextField
                name="firstName"
                fullWidth
                label="First Name"
                {...getFieldProps('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
              <TextField
                name="lastName"
                fullWidth
                label="Last Name"
                {...getFieldProps('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Stack>

            {/* Email */}
            <TextField
              name="emailId"
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('emailId')}
              error={Boolean(touched.emailId && errors.emailId)}
              helperText={touched.emailId && errors.emailId}
            />

            {/* Mobile Number */}
            <TextField
              name="mobileNumber"
              fullWidth
              label="Mobile Number"
              type="tel"
              inputProps={{ maxLength: 10 }}
              {...getFieldProps('mobileNumber')}
              error={Boolean(touched.mobileNumber && errors.mobileNumber)}
              helperText={touched.mobileNumber && errors.mobileNumber}
            />

            {/* Password */}
            <TextField
              name="password"
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />

            {/* Submit Button */}
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Register
            </LoadingButton>
          </Stack>

          {/* Remember Me and Forgot Password */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            />
            <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
              Forgot password?
            </Link>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
}
