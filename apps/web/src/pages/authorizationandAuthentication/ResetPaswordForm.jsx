import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from 'react-spinners';
import loginImage from '../../assets/masnstay.jpg';
import { Typography } from '@material-tailwind/react';

const ResetPasswordForm = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log(params, 'ini params');
        values.email = params.email;
        setLoading(true);
        const response = await axios.patch(
          'http://localhost:8000/api/user/update-password',
          values,
        );
        console.log('Password reset success:', response.values);
        setLoading(false);

        toast.success("Password Reset Successful", {
          position: 'top-center',
          autoClose: 9000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        navigate('/');
      } catch (error) {
        console.error('Password Reset Error:', error);
        setLoading(false);
        toast.error(error.response?.data?.error || 'Error resetting password', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
  });

  return (
    <div className="p-4 border-2 border-gray-300 rounded-md w-72 mx-auto">
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

      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {formik.touched.newPassword && formik.errors.newPassword ? (
            <div className="text-red-500 text-sm">
              {formik.errors.newPassword}
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="mt-1 p-2 w-full border rounded-md"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-sm">
              {formik.errors.confirmPassword}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-yellow-500 text-black rounded-md"
          disabled={loading}
        >
          {loading ? <SyncLoader color="#ffffff" size={8} /> : 'Reset Password'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
