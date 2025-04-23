import Swal from 'sweetalert2';
import { createContext, useContext } from 'react';
import withReactContent from 'sweetalert2-react-content';

const AlertContext = createContext();
const MySwal = withReactContent(Swal);

// Hook para usar el contexto
export const useAlert = () => {
  const showAlert = ({ message, severity = 'info', title }) => {
    const iconMap = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    };

    MySwal.fire({
      icon: iconMap[severity] || 'info',
      title: title || prettyTitle(severity),
      html: `<div style="font-size: 16px; color: #555;">${message}</div>`,
      background: '#fff',
      showConfirmButton: true,
      confirmButtonColor: getColor(severity),
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'rounded-xl shadow-lg',
        confirmButton: 'rounded-md px-5 py-2 text-sm',
      },
      zIndex: 9999, // Asegura que la alerta esté por encima de otros elementos
    });
  };

  const showConfirmation = ({
    title = '¿Estás seguro?',
    message = 'Esta acción no se puede deshacer.',
    confirmButtonText = 'Sí, confirmar',
    cancelButtonText = 'Cancelar',
    onConfirm,
  }) => {
    MySwal.fire({
      title: `<span style="font-size: 22px;">${title}</span>`,
      html: `<div style="font-size: 15px; color: #555;">${message}</div>`,
      icon: 'warning',
      background: '#fff',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#bbb',
      confirmButtonText,
      cancelButtonText,
      customClass: {
        popup: 'rounded-xl shadow-lg',
        confirmButton: 'rounded-md px-5 py-2 text-sm',
        cancelButton: 'rounded-md px-5 py-2 text-sm',
      },
    }).then((result) => {
      if (result.isConfirmed && typeof onConfirm === 'function') {
        onConfirm();
      }
    });
  };

  return {
    showAlert,
    showConfirmation,
  };
};

// Estilo de título dependiendo del tipo
const prettyTitle = (severity) => {
  switch (severity) {
    case 'success':
      return '¡Éxito!';
    case 'error':
      return '¡Oops!';
    case 'warning':
      return '¡Atención!';
    case 'info':
    default:
      return 'Información';
  }
};

// Color de botón según tipo
const getColor = (severity) => {
  switch (severity) {
    case 'success':
      return '#22c55e';
    case 'error':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    case 'info':
    default:
      return '#3b82f6';
  }
};

// No usamos provider con estado
export const AlertProvider = ({ children }) => children;
