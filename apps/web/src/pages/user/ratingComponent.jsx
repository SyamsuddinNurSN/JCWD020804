import React, { useState } from 'react';
import { Dialog, Rating } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function RatingWithCommentDialog({
  Open,
  onClose,
  TransactionId,
  setSelectedTransactionId,
  PropertyId,
  setSelectedPropertyId,
  onSubmitRating,
  setRatingGivenCallback,
}) {
  const user = useSelector((state) => state.user.value);
  const [ratingGivenDialog, setRatingGivenDialog] = useState(false);

  const validationSchema = Yup.object().shape({
    rating: Yup.number().required('Rating is required'),
    comment: Yup.string().required('Comment is required'),
  });

  const handleCloseDialog = () => {
    onClose();

    if (ratingGivenDialog) {
      setSelectedTransactionId(null);
      setSelectedPropertyId(null);
      setRatingGivenCallback(); // Memanggil fungsi callback untuk memberitahu UserDashboard bahwa rating sudah diberikan
    }
  };

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Handle form submission logic here
      console.log('Form submitted:', values);
      handleGiveRating(values);
      // Reset the form after submission
      resetForm();
      handleCloseDialog();
    },
  });

  const token = localStorage.getItem('token');

  const handleGiveRating = async (values) => {
   
    try {
      values.TransactionId = TransactionId;
      values.PropertyId = PropertyId;
      // console.log(values);
      const response = await axios.post(
        'http://localhost:8000/api/transaction/ratings', // Replace with your actual API endpoint for submitting ratings
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSelectedTransactionId(null);
      setSelectedPropertyId(null);
      setRatingGivenDialog(true);
      onSubmitRating();

    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <Dialog
      size="md"
      open={Open}
      handler={handleCloseDialog}
      className="bg-transparent shadow-none"
    >
      <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-lg">
        <div className="text-center">{user.name}</div>
        <form onSubmit={formik.handleSubmit} className="text-center">
          <Rating
            value={formik.values.rating}
            onChange={(value) => formik.setFieldValue('rating', value)}
          />
          {formik.touched.rating && formik.errors.rating ? (
            <div className="text-red-500">{formik.errors.rating}</div>
          ) : null}
          <textarea
            className="w-full h-20 p-2 mt-4 border rounded-md"
            placeholder="Add your review..."
            name="comment"
            value={formik.values.comment}
            onChange={formik.handleChange}
          />
          {formik.touched.comment && formik.errors.comment ? (
            <div className="text-red-500">{formik.errors.comment}</div>
          ) : null}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </Dialog>
  );
}
