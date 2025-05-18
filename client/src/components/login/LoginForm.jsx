import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material UI components
import {
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Link
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// custom components
import Iconify from '../Iconify';
import { login } from '../../services/auth';
import useResponsive from '../../theme/hooks/useResponsive';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const smUp = useResponsive('up', 'sm');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(' ');
  const [showPassword, setShowPassword] = useState(false);

  // Yup validation schema
  const LoginSchema = Yup.object().shape({
    emailId: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
    mobileNumber: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  });

  const formik = useFormik({
    initialValues: {
      emailId: '',
      password: '',
      mobileNumber: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      // Call login service on submit
      await login(values, setShowAlert, setAlertMessage);
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
      {/* Snackbar for login errors */}
      <Snackbar open={showAlert} autoHideDuration={6000}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Show error alert on larger screens */}
            {smUp && showAlert && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            )}

            {/* Email Input */}
            <TextField
              name="emailId"
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address or Mobile Number"
              {...getFieldProps('emailId')}
              error={Boolean(touched.emailId && errors.emailId)}
              helperText={touched.emailId && errors.emailId}
            />

            {/* Password Input */}
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
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </Stack>

          {/* Remember Me and Forgot Password */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  {...getFieldProps('remember')}
                  checked={values.remember}
                />
              }
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
