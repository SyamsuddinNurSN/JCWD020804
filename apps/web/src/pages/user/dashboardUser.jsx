import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Button } from '@material-tailwind/react';
import { RatingWithCommentDialog } from './ratingComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbarpage } from '../../components/navbar';

export const UserDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const token = localStorage.getItem('token');
  const [ratingGivenUserDashboard, setRatingGivenUserDashboard] = useState(false);
  const navigate = useNavigate();

  const handleToggleDialog = (transactionId, propertyId) => {
    setSelectedTransactionId(transactionId);
    setSelectedPropertyId(propertyId);
    setDialogOpen((cur) => !cur); // Toggle the dialog state
  };

  const handleContinue = (transactionId) => {
    setSelectedTransactionId(transactionId)
    navigate(`/booking-detail/${transactionId}`);
  }

  const formatDate = (date) => {
    const dateFormat = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return dateFormat.format(date);
  };

  const getDataTransaction = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/transaction/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            status: statusFilter,
            search: searchInput,
            date: searchDate,
          },
        },
      );
      setTransactions(response?.data.result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchDateChange = (event) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const formattedDate = dateObj.toISOString().split('T')[0];
      setSearchDate(formattedDate);
      console.log(formattedDate);
    } else {
      setSearchDate('');
    }
  };

  useEffect(() => {
    getDataTransaction();
  }, [statusFilter, searchInput, searchDate, ratingGivenUserDashboard]);

  return (
    <div className='p-5'>
    <Navbarpage/>
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-semibold mb-6">Your Trips</h1>
      <div className="flex gap-4 mb-4">
        <Button
          color={statusFilter === 'all' ? 'blue' : 'gray'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </Button>
        <Button
          color={statusFilter === 'ongoing' ? 'blue' : 'gray'}
          onClick={() => handleFilterChange('ongoing')}
        >
          Ongoing
        </Button>
        <Button
          color={statusFilter === 'completed' ? 'blue' : 'gray'}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </Button>
        <input
          type="text"
          placeholder="Search by booking ID"
          value={searchInput}
          onChange={handleSearchInputChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          value={searchDate}
          onChange={handleSearchDateChange}
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <Button color="blue" onClick={() => getDataTransaction()}>
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <div className="p-4">
              <Typography className="mb-2">
                {formatDate(new Date(transaction.checkIn))}
              </Typography>
              <Typography className="mb-2">
                Nama Property: {transaction.Room.Property.name}
              </Typography>
              <Typography className="mb-2">
                Hosted by: {transaction.Room.Property.User.name}
              </Typography>
              <Typography className="mb-2">
                {transaction.status}
              </Typography>
              {transaction.status === 'menunggu pembayaran' && (
                  <Button
                    onClick={() =>
                      handleContinue(transaction.id)
                    }
                  >
                   Continue
                  </Button>
                )}
              {transaction.status === 'pembayaran berhasil' &&
                new Date(transaction.checkIn) < new Date() &&
                !transaction.Review?.rating && (
                  <Button
                    onClick={() =>
                      handleToggleDialog(
                        transaction.id,
                        transaction.Room.Property.id,
                      )
                    }
                  >
                    Give Rating
                  </Button>
                )}
              {transaction.Review?.rating && (
                <Typography className="text-green-500">Rating Given</Typography>
              )}
            </div>
          </Card>
        ))}
      </div>
      <RatingWithCommentDialog
        Open={dialogOpen}
        onClose={handleToggleDialog}
        TransactionId={selectedTransactionId}
        setSelectedTransactionId={setSelectedTransactionId}
        PropertyId={selectedPropertyId}
        setSelectedPropertyId={setSelectedPropertyId}
        onSubmitRating={() => setRatingGivenUserDashboard(true)}
        setRatingGivenCallback={() => setRatingGivenUserDashboard(true)}
      />
    </div>
    </div>
  );
};
