import { useState } from "react";
import { XCircleIcon } from '@heroicons/react/24/solid'
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";

const AuthModal = ({ closeModal, onLoginSuccess }) => {
  const [showSignup, setShowSignup] = useState(false);

  const switchForm = () => {
    setShowSignup(!showSignup);
  };

  const handleLoginSuccess = () => {
    onLoginSuccess();
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2"
        >
           <XCircleIcon className="h-6 w-6 text-slate-900"/>
        </button>
        {showSignup ? (
          <SignupForm closeModal={closeModal} toggleForm={switchForm} />
        ) : (
          <LoginForm toggleForm={switchForm} onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
