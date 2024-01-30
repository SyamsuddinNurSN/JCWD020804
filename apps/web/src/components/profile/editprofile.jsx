import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  picture: Yup.mixed().test(
    'fileSize',
    'Photo size is too large (max 2 MB)',
    (value) => {
      console.log('value: ', value);
      if (!value) return true; // Allow empty file (user might not want to change the photo)
      return value.size <= 2 * 1024 * 1024; // 2 MB
    },
  ),
});

export const EditProfile = () => {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.user.value);
  const id = user.id;
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      picture: null,
    },
    EditProfileSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        const authToken = token;
        console.log('values:', values);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('picture', values.picture);

        const url = 'http://localhost:8000/api/user/edit-profile/:id';

        try {
          const response = await axios.patch(url, formData, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          const notif = () => {
            toast.success('Your profile has been successfully updated. Please check your email for verification', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              onClose: () => {
                // navigate('/');
                setTimeout(() => {}, 5000);
              },
            });
          };

          console.log('Response:', response.data);
          notif();
        } catch (error) {
          console.error('Error:', error.message);
        }

        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });
  return (
    <>
      <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 mx-auto">
        <Link
          to="#"
          className="block mt-4 text-center text-black hover:text-yellow-800"
          onClick={() => setShowModal(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          ></svg>
          Edit Profile
        </Link>
      </div>

      <div
        className="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Edit Profile
                  </h3>
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.nik}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 p-2 w-full border rounded-md ${
                          formik.touched.name && formik.errors.name
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 p-2 w-full border rounded-md ${
                          formik.touched.username && formik.errors.username
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 p-2 w-full border rounded-md ${
                          formik.touched.email && formik.errors.email
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="picture"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Your Picture
                      </label>
                      <input
                        type="file"
                        id="picture"
                        name="picture"
                        accept="image/*"
                        onChange={(event) => {
                          formik.setFieldValue(
                            'picture',
                            event.currentTarget.files[0],
                          );
                          formik.setFieldTouched('picture', true);
                        }}
                        className={`mt-1 p-2 w-full border rounded-md ${
                          formik.touched.ktpImage && formik.errors.ktpImage
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {formik.touched.picture && formik.errors.picture && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.picture}
                        </p>
                      )}
                    </div>
                    {formik.values.picture && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Preview Your Picture
                        </label>
                        <img
                          src={URL.createObjectURL(formik.values.picture)}
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
                        Cancel Edit Profile ?{' '}
                        <Link to="/" className="text-black underline">
                          Home
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
