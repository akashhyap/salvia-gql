// components/Modal.js
import { useRef } from 'react';

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef();

  const handleClose = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    show && (
      <div
        ref={modalRef}
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg">{children}</div>
      </div>
    )
  );
};

export default Modal;
