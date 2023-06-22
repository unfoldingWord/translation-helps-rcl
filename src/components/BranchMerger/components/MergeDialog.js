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
    const [checked, setChecked] = useState([]);
    const [isChecked, setIsChecked] = useState(false);


    // const getSelectedTargets = () => {
    //     const { description, mergeableCardIds } = Array.from(formRef.current).reduce((formData, input) => {
    //         if (input.type === 'checkbox' && input.checked) {
    //             formData.mergeableCardIds.push(input.value);
    //             return formData;
    //         }
    //         if (input.name === 'description') {
    //             formData.description = input.value;
    //             return formData;
    //         }
    //         return formData;
    //     }, { description: '', mergeableCardIds: [] });
    //     console.log(mergeableCardIds)
    //     onSubmit({ mergeableCardIds, description })
    // }
    const descriptionRef = useRef(null);
    const handleChange1 = (event) => {
        console.log(event.target);
        if (event.target.checked) {
            setChecked((checked) => [...checked, event.target.value]);
        } else {
            setChecked((checked) => checked.filter((item) => item !== event.target.value));
        }
    };

    console.log({ checked });

    const getSelectedTargets = () => {
        const description = descriptionRef.current.value;
        const mergeableCardIds = checked
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
                    {console.log('index', checked.includes(ele))}
                    <FormControlLabel
                        label={ele}
                        control={<Checkbox
                            // value={ele}
                            checked={checked.includes(ele)}
                            onChange={handleChange1} />}
                    />
                </Box>
            ))
            }
        </>
    ), [checked]);

    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Merge</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Clicking submit will merge your current work with your team's work. Please add a comment below about the changes that you are submitting.
                </DialogContentText>
                <div>
                    {children}
                </div>
                <TextField
                    name='description'
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
                <Button
                    onClick={() => {
                        const { description, mergeableCardIds } = Array.from(formRef.current).reduce((formData, input) => {
                            console.log('formData.mergeableCardIds', formData.mergeableCardIds)
                            if (input.type === 'checkbox' && input.checked) {
                                formData.mergeableCardIds.push(input.value);
                                return formData;
                            }
                            if (input.name === 'description') {
                                formData.description = input.value;
                                return formData;
                            }
                            console.log('formData', formData)
                            return formData;
                        }, { description: '', mergeableCardIds: [] });
                        console.log({ mergeableCardIds })
                        onSubmit({ mergeableCardIds, description })
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