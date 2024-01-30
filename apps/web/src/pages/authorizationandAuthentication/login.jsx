import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../../assets/masnstay.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setData } from '../../redux/userSlice';
import { Button } from '@material-tailwind/react';
import { registerWithGoogle } from '../../../../api/src/firebase';
import { SyncLoader } from 'react-spinners';
import { ModalUserResetPassword } from './ModalUserResetPassword';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(!modalOpen);
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Minimum 8 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,

    onSubmit: handleSubmitLogin,
  });

  const notif = () => {
    toast.success('Log In success', {
      position: 'top-right',
      autoClose: 9000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  async function handleSubmitLogin(values) {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/login`,
        { email: values.email, password: values.password },
      );

      setUser(response.data.result);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isTenant', response.data.isTenant)
      console.log(response.data);
      console.log(user);
      if (!response.data.result.isVerified) {
        toast.success('You Must Verifikasi', {
          position: 'top-right',
          autoClose: 9000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });

        navigate('/login');
        return;
      } else if (user.isVerified) {
      }

      dispatch(setData(response.data.result));

      navigate('/');
      // window.location.reload();

      notif();
    } catch (err) {
      console.error(err);

      // Handle specific error message or show a general message
      const errorMessage =
        err.response?.data.error || 'An error occurred during login.';

      toast.error(`Log In Failed: ${errorMessage}`);
    }
  }
  const handleGoogleRegister = async () => {
    try {
      const userData = await registerWithGoogle();
      console.log(userData);

      const response = await axios.post(
        'http://localhost:8000/api/user/register-google',
        { googleUserData: userData },
      );
      console.log(response);
      localStorage.setItem('token', response.data.token);

      dispatch(setData(response.data.result));
      toast.success('Log In With Google Success', {
        position: 'top-right',
        autoClose: 9000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate('/');
    } catch (error) {
      console.log('Error from handle Google Register Front-end', error);
      toast.error('You Must Register With Google', {
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
  };

  return (
    <>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md w-96 rounded-xl bg-clip-border mx-auto">
        <div className="relative grid mx-4 mb-4 -mt-2 overflow-hidden text-yellow-500 shadow-lg h-40 place-items-center rounded-xl bg-white bg-clip-border shadow-md/20 p-4">
          <Link to="/">
            <img
              className="object-cover h-20 w-full mb-2"
              src={loginImage}
              alt="Logo masnstay"
            />
          </Link>
          <h3 className="text-lg font-semibold text-black">
            Welcome to MasnStay
          </h3>
          <h6 className="mt-2">✨✨✨✨✨✨✨</h6>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-4 p-6">
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder="Email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-900 text-xs">
                  {formik.errors.email}
                </div>
              ) : null}
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Email
              </label>
            </div>
            <div className="relative h-11 w-full min-w-[200px]">
              <input
                className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                placeholder=""
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-900 text-xs">
                  {formik.errors.password}
                </div>
              ) : null}
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Password
              </label>
            </div>
            <div className="-ml-2.5">
              <div className="inline-flex items-center">
                <label
                  htmlFor="checkbox"
                  className="relative flex items-center p-3 rounded-full cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                    id="checkbox"
                  />
                  <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>

                <label
                  className="mt-px font-light text-gray-700 cursor-pointer select-none"
                  htmlFor="checkbox"
                >
                  Remember Me
                </label>
              </div>
              <div className="flex justify-end" onClick={handleModalOpen}>
                <span className="w-full cursor-pointer text-end text-[14px] text-gray-600 hover:text-gray-700 hover:underline hover:decoration-1">
                  Reset Password?
                </span>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button
              className={`block w-full select-none rounded-lg bg-gradient-to-tr from-yellow-500 to-yellow-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-yellow-500/10 transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:opacity-85 ${
                formik.isSubmitting
                  ? 'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                  : ''
              }`}
              type="submit"
              variant="outlined"
              disabled={formik.isSubmitting}
            >
              <span className="button-text">
                {formik.isSubmitting ? (
                  <div className="flex justify-center items-center">
                    <SyncLoader color="#c0cac2" size={9} />
                  </div>
                ) : (
                  'Log In'
                )}
              </span>
            </Button>
            <div className="mb-4"></div>
            <Button
              className="block w-full select-none rounded-lg bg-gradient-to-tr from-yellow-500 to-yellow-300 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-yellow-500/10 transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:opacity-85 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={handleGoogleRegister}
              variant="outlined"
              loading={true}
            >
              Log In with Google
            </Button>
            <ToastContainer />
            <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
              Don't have an account?
              <Link
                to="/register"
                className="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
              >
                Register
              </Link>
            </p>
            <p className="flex justify-center mt-6 font-sans text-sm antialiased font-light leading-normal text-inherit">
              Back to Home?
              <Link
                to="/"
                className="block ml-1 font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900"
              >
                Home
              </Link>
            </p>
          </div>
        </form>
      </div>
      <ModalUserResetPassword
        modalOpen={modalOpen}
        handleModalOpen={handleModalOpen}
      />
    </>
  );
};

export default Login;
