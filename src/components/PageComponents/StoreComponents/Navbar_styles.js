import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  navbar: 
  {
    backgroundColor: '#3f51b5',
    boxShadow: '0 2px 3px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    height: '80px',
  },
  navLink: {
    color: 'white',
  },
  button: 
  {
    fontSize: '1.5rem',
    color: 'white',
    backgroundColor: 'transparent', // Make the background transparent
    border: 'none', // Remove border
    boxShadow: 'none', // Remove box shadow
    '&:hover': {
    backgroundColor: 'transparent', // Keep the background transparent on hover
    boxShadow: 'none',}, // Remove box shadow on hover
  },
}));

export const summarybuttonStyle = {
  // Customize your button styles here
  width: '5rem',
  height: '5rem',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '0',
  cursor: 'pointer',
};
