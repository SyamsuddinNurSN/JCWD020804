import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from '@material-tailwind/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../../assets/masnstay.jpg';
import { useNavigate } from 'react-router-dom';
import { registerWithGoogle } from '../../../../api/src/firebase';
import { useDispatch } from 'react-redux';
import { setData } from '../../redux/userSlice';


export const Register = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch()


  const notify = () =>
    toast.success('Register Success!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleSubmit = async (data) => {
    try {
      await axios.post('http://localhost:8000/api/user/register', data);
      console.log(data, 'ini data');
      navigate('/');
      notify();
    } catch (err) {
      console.log(err);
      toast.error(err.response.data)
    }
  };

  const RegisterSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    username: Yup.string().required('Username is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Minimum 8 characters'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },

    validationSchema: RegisterSchema,
    onSubmit: (values, actions) => {
      console.log(values, 'ini values');
      handleSubmit(values);
      actions.resetForm();
    },
  });

  const handleGoogleRegister = async () => {
    try {
        const userData = await registerWithGoogle();
        console.log(userData);
  
        const response = await axios.post('http://localhost:8000/api/user/register-google', { googleUserData: userData })
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        
        dispatch(setData(response.data.result));
       
          toast.success(response.data.message, {
            position: 'top-right',
            autoClose: 9000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        
        navigate('/')
    } catch (error) {
        console.log("Error from handle Google Register Front-end", error);
        
          toast.error(error.response.data.message, {
            position: 'top-right',
            autoClose: 9000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      
      <Card
        color="transparent"
        shadow={false}
        className="w-full max-w-md p-8 space-y-6"
      >
        <a href="/">
          <img
            className="object-contain h-16 w-full mb-4"
            src={loginImage}
            alt="Logo masnstay"
          />
        </a>

        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.😁😮
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Name
            </Typography>
            <Input
              size="lg"
              placeholder="name"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className=" text-red-900 text-xs">{formik.errors.name}</div>
            ) : null}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
              error={formik.touched.username && Boolean(formik.errors.username)}
            />
            {formik.touched.username && formik.errors.username ? (
              <div className=" text-red-900 text-xs">
                {formik.errors.username}
              </div>
            ) : null}

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className=" text-red-900 text-xs">{formik.errors.email}</div>
            ) : null}
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className=" text-red-900 text-xs">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: '-ml-2.5' }}
          />
          <Button
            type="submit"
            className="mt-6 bg-yellow-500 text-black"
            fullWidth
            variant="outlined"
            loading={true}
          >
            Register
          </Button>
          <Button
            onClick={handleGoogleRegister}
            className="mt-6 bg-yellow-500 text-black"
            fullWidth
            variant="outlined"
            loading={true}
          >
            Register with Google
          </Button>

          <ToastContainer />
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-gray-900">
              Log In
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
};
