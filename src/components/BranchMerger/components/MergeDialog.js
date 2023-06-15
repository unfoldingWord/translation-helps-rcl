import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useRef } from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function MergeDialog({ onSubmit, onCancel, open, isLoading, loadingProps, mergeStatusForCards, cardMergeGroupings }) {
    const [checked, setChecked] = React.useState([true, false]);

    console.log('MergeDialog', cardMergeGroupings, mergeStatusForCards);

    const descriptionRef = useRef(null);
    const handleChange1 = (event) => {
        setChecked([event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange3 = (event) => {
        setChecked([checked[0], event.target.checked]);
    };

    const children = (
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
            <FormControlLabel
                label="Child 1"
                control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
            />
            <FormControlLabel
                label="Child 2"
                control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
            />
        </Box>
    );

    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Merge</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Clicking submit will merge your current work with your team's work. Please add a comment below about the changes that you are submitting.
                </DialogContentText>
                {/* <div>
                    <FormControlLabel
                        // label={cardMergeGroupings?.cardId}
                        control={
                            <Checkbox
                                checked={checked[0] && checked[1]}
                                indeterminate={checked[0] !== checked[1]}
                                onChange={handleChange1}
                            />
                        }
                    />
                    {children}
                </div> */}
                <TextField
                    inputRef={descriptionRef}
                    autoFocus
                    margin="dense"
                    id="merge-description"
                    label="Description"
                    type="text"
                    minRows={2}
                    fullWidth
                    multiline
                    disabled={isLoading}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    onSubmit(descriptionRef.current.value)
                }}
                    color="primary"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <CircularProgress size='1rem' style={{ marginRight: '0.5rem' }} {...loadingProps} />{' '}
                            {' Sending...'}
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}