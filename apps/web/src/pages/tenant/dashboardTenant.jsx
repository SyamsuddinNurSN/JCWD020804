import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PaymentProofDialog } from './paymentProof';

export const TenantDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [processedTransactions, setProcessedTransactions] = useState([]);
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.user.value);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);
  const openPaymentProofDialog = (id) => {
    console.log('Opening Dialog for Transaction ID:', id);
    setSelectedTransactionId(id);
  };

  const closePaymentProofDialog = () => {
    console.log('Closing Dialog');
    setSelectedTransactionId(null);
  };

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
        'http://localhost:8000/api/transaction/tenant',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            statusFilter: statusFilter,
          },
        },
      );
      
      const data = response?.data.result;

      if (!data || data.length === 0) {
        setNoDataMessage('Tidak ada pesanan yang Anda cari.');
      } else {
        setNoDataMessage(null);
      }

      setTransactions(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataTransaction();
  }, [statusFilter]);

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/transaction/tenant/${id}/approve`,
        { status: 'pembayaran berhasil' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`Approving transaction ${id}`);

      setTransactions((prevTransactions) => {
        return prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, status: 'pembayaran berhasil' }
            : transaction,
        );
      });

      setProcessedTransactions((prevTransactions) => [...prevTransactions, id]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/transaction/tenant/${id}/reject`,
        { status: 'menunggu pembayaran' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTransactions((prevTransactions) => {
        return prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, status: 'menunggu pembayaran' }
            : transaction,
        );
      });

      setProcessedTransactions((prevTransactions) => [...prevTransactions, id]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/transaction/tenant/${id}/cancel`,
        { status: 'transaksi dibatalkan' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`canceling transaction ${id}`);

      setTransactions((prevTransactions) => {
        return prevTransactions.map((transaction) =>
          transaction.id === id
            ? { ...transaction, status: 'transaksi dibatalkan' }
            : transaction,
        );
      });

      setProcessedTransactions((prevTransactions) => [...prevTransactions, id]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-semibold mb-6 text-yellow-600">
        Tenant Dashboard
      </h1>
      <h1 className="text-3xl font-semibold mb-6 text-yellow-600">
        {user.name}
      </h1>

      {/* Filter buttons */}
      <div className="flex my-4">
        <button
          className={`mr-4 px-4 py-2 ${
            statusFilter === 'all' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        <button
          className={`mr-4 px-4 py-2 ${
            statusFilter === 'onProcess'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200'
          }`}
          onClick={() => setStatusFilter('onProcess')}
        >
          On Process
        </button>
        <button
          className={`mr-4 px-4 py-2 ${
            statusFilter === 'onGoing'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200'
          }`}
          onClick={() => setStatusFilter('onGoing')}
        >
          On Going
        </button>
        <button
          className={`px-4 py-2 ${
            statusFilter === 'cancel'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200'
          }`}
          onClick={() => setStatusFilter('cancel')}
        >
          Cancel
        </button>
      </div>
      {noDataMessage && <p className="text-red-500">{noDataMessage}</p>}
      {transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border rounded-lg">
            <thead className="bg-yellow-200">
              <tr>
                <th className="border p-3">Tanggal Checkin</th>
                <th className="border p-3">Nama Pemesan</th>
                <th className="border p-3">Nama Kamar</th>
                <th className="border p-3">Status</th>
                <th
                  className={`border p-3 ${
                    statusFilter === 'cancel' ? 'hidden' : ''
                  }`}
                >
                  Payment Proof
                </th>
                {transactions.some(
                  (transaction) => transaction.status === 'menunggu konfirmasi',
                ) && <th className="border p-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="bg-white">
                  <td className="border p-3">
                    {formatDate(new Date(transaction.checkIn))}
                  </td>
                  <td className="border p-3">{transaction.User.name}</td>
                  <td className="border p-3">{transaction.Room.name}</td>
                  <td className="border p-3">{transaction.status}</td>
                  <td
                    className={`border p-3 ${
                      statusFilter === 'cancel' ? 'hidden' : ''
                    }`}
                  >
                    {transaction.bukti_pembayaran && (
                      <button
                        className="text-blue-500 underline"
                        onClick={() => openPaymentProofDialog(transaction.id)}
                      >
                        View Payment Proof
                      </button>
                    )}
                  </td>
                  {transaction.status === 'menunggu konfirmasi' && (
                    <td className="border p-3">
                      <button
                        onClick={() => handleApprove(transaction.id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(transaction.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Reject
                      </button>
                    </td>
                  )}

                  {transaction.status === 'menunggu pembayaran' && (
                    <td className="border p-3">
                      <button
                        onClick={() => handleCancel(transaction.id)}
                        className="bg-yellow-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PaymentProofDialog
        isOpen={selectedTransactionId !== null}
        onClose={closePaymentProofDialog}
        imageUrl={
          selectedTransactionId
            ? `http://localhost:8000/${
                transactions.find(
                  (transaction) => transaction.id === selectedTransactionId,
                )?.bukti_pembayaran
              }`
            : ''
        }
      />
    </div>
  );
};
