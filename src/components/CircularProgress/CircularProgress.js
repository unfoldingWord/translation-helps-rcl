import { makeStyles } from '@material-ui/core/styles'
import CircularProgressUI from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: '3rem',
  },
}))

function CircularProgress({ size }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgressUI size={size} />
    </div>
  )
}

export default CircularProgress
