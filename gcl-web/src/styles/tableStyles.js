export const tableStyles = {
  tableContainer: {
    mt: 2,
    borderRadius: 2,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 600,
      color: '#1a1a1a',
      fontSize: '0.95rem'
    }
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  },
  actionIcons: {
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'transform 0.2s ease-in-out'
    }
  },
  deleteIcon: {
    color: '#ff4444',
    '&:hover': {
      color: '#cc0000'
    }
  },
  editIcon: {
    color: '#00c851',
    '&:hover': {
      color: '#007e33'
    }
  },
  specialCell: {
    fontWeight: 500,
    color: '#1a73e8'
  }
};

export const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  '& .MuiTextField-root': {
    mb: 2
  }
};