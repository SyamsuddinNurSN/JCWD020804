import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import loginImage from '../../assets/masnstay.jpg';

function Verify() {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const notif = () => {
    toast.success(' User has been verified success', {
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

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/user/verify/${id}`,
        { isVerified: true },
        {
          headers: {
            Authorization: `Bearer ${params.token}`,
          },
        },
      );
      navigate('/login');
      notif();
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <div className="flex flex-col items-center justify-center h-screen">
    <a href="/">
      <img
        className="object-contain h-16 w-full mb-4"
        src={loginImage}
        alt="Logo masnstay"
      />
    </a>
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl text-yellow-500">Account Verification</h1>
      </div>
      <div className="mb-4">
        <button
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg"
          onClick={handleSubmit}
        >
          Verify Account
        </button>
      </div>
    </div>
  </div>
);

}

export default Verify;
