import React from 'react';
import { ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Tenant = () => {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    nik: Yup.string().required('Number NIK is required'),
    ktpImage: Yup.mixed().test(
      'fileSize',
      'File size is too large (max 2 MB)',
      (value) => {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024; // 2 MB
      },
    ),
  });

  const formik = useFormik({
    initialValues: {
      nik: '',
      ktpImage: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        const authToken = token;

        const formData = new FormData();
        formData.append('no_ktp', values.nik);
        formData.append('foto_ktp', values.ktpImage);

        const response = await fetch(
          'http://localhost:8000/api/user/become-tenant/:id',
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            body: formData,
          },
        );

        const notif = () => {
          toast.success(
            'Congratulations! You have successfully become a tenant',
            {
              position: 'top-right',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              onClose: () => {
                navigate('/');
                setTimeout(() => {
                  window.location.reload();
                }, 5000);
              },
            },
          );
        };

        console.log(response);
        notif();
        resetForm();
      } catch (error) {
        console.error(error);
      }
      const ErrorMessage =
        err.response?.data.error || 'An error occurred become a tenant.';
      toast.error(`Your failed become a tenant: ${ErrorMessage}`);
    },
  });

  return (
    <div className="max-w-md bg-white p-8 rounded shadow-md w-96 bg-clip-border mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Become a Tenant</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nik"
            className="block text-sm font-medium text-gray-700"
          >
            Number NIK
          </label>
          <input
            type="text"
            id="nik"
            name="nik"
            value={formik.values.nik}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`mt-1 p-2 w-full border rounded-md ${
              formik.touched.nik && formik.errors.nik
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            required
          />
          {formik.touched.nik && formik.errors.nik && (
            <p className="text-red-500 text-sm">{formik.errors.nik}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="ktpImage"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Photo KTP
          </label>
          <input
            type="file"
            id="ktpImage"
            name="ktpImage"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue('ktpImage', event.currentTarget.files[0]);
              formik.setFieldTouched('ktpImage', true);
            }}
            className={`mt-1 p-2 w-full border rounded-md ${
              formik.touched.ktpImage && formik.errors.ktpImage
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            required
          />
          {formik.touched.ktpImage && formik.errors.ktpImage && (
            <p className="text-red-500 text-sm">{formik.errors.ktpImage}</p>
          )}
        </div>
        {formik.values.ktpImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Preview Photo KTP
            </label>
            <img
              src={URL.createObjectURL(formik.values.ktpImage)}
              alt="Preview KTP"
              className="mt-2 w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="text-black shadow bg-yellow-500 px-4 py-2 rounded-md"
          >
            Send
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-700">
            Cancel Become A Tenant?{' '}
            <Link to="/" className="text-black underline">
              Home
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Tenant;
