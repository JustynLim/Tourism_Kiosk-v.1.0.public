import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  app: 
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'rgb(255, 255, 255)',
    backgroundColor: '#fff', // Change this to your preferred background color

  },
  authFormContainer: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '50%',
    maxHeight: '80%',
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      padding: '5rem',
      border: '1px solid rgb(0, 255, 255)',
      borderRadius: '10px',
      margin: '0.5rem',
    },
  },
  label: {
    textAlign: 'left',
    padding: '0.25rem 0',
  },
  input: {
    margin: '0.5rem 0',
    padding: '1rem',
    border: 'none',
    borderRadius: '10px',
  },
  button: {
    border: 'none',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#7439db',
  },
  linkBtn: {
    background: 'none',
    color: 'rgba(0, 238, 255, 0.815)',
  },
}));