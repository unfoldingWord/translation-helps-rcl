import React, { useMemo, useState } from 'react';
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
import { FormGroup } from '@mui/material';

export default function MergeDialog({ onSubmit, onCancel, open, isLoading, loadingProps, mergeStatusForCards }) {
    const formRef = useRef(null);


    const getSelectedTargets = () => {
        const { description, mergeableCardIds } = Array.from(formRef.current).reduce((formData, input) => {
            if (input.type === 'checkbox' && input.checked) {
                formData.mergeableCardIds.push(input.value);
                return formData;
            }
            if (input.name === 'description') {
                formData.description = input.value;
                return formData;
            }
            return formData;
        }, { description: '', mergeableCardIds: [] });
        onSubmit({ description, mergeableCardIds })
    }

    let newMergeStatusForCards = [];
    let cardNames = {
        tn: 'Translation Notes',
        ta: 'Translation Academy',
        tq: 'Translation Questions',
        ust: 'UnfoldingWord Simplified Text',
        ult: 'UnfoldingWord Literal Text',
        twa: 'Translation Words Article',
        twl: 'Translation Words List'
    };

    for (const [key, value] of Object.entries(mergeStatusForCards)) {
        if (value.mergeToMaster.mergeNeeded === true) {
            newMergeStatusForCards = [...newMergeStatusForCards, `${key}`]
        }
        console.log({ newMergeStatusForCards });
    }

    const children = useMemo(() => (
        <>
            {newMergeStatusForCards.map((ele, index) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                    <FormControlLabel
                        label={ele}
                        control={<Checkbox
                            name={ele}

                            value={ele}
                        />}
                    />
                </Box>
            ))
            }
        </>
    ), []);

    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Merge</DialogTitle>
            <DialogContent>
                <form ref={formRef}>
                    <DialogContentText>
                        Clicking submit will merge your current work with your team's work. Please add a comment below about the changes that you are submitting.
                    </DialogContentText>
                    <div>
                        {children}
                    </div>
                    <TextField
                        name='description'
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
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary" disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={getSelectedTargets}
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