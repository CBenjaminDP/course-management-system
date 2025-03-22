import LoginForm from '../../components/Login/Login';
import { Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;