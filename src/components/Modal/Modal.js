import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
const { Overlay, ModalWindow } = require('./Modal.styled');
const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ onClose, children }) => {
  // const handleKeyDown = event => {
  //   if (event.code === 'Escape') {
  //     onClose();
  //   }
  // };
  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow> {children}</ModalWindow>
    </Overlay>,
    modalRoot
  );
};
Modal.propTypes = {
  onclose: PropTypes.func,
};
