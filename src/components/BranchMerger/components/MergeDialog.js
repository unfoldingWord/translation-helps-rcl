import React, { useCallback, useMemo, useState } from 'react';
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
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import PropTypes from "prop-types";
import { mergeStatusData as mergeStatusForCards } from '../../../Data/mergeStatusData';

let cardNames = {
    tn: 'Translation Notes',
    ta: 'Translation Academy',
    tq: 'Translation Questions',
    ust: 'UnfoldingWord Simplified Text',
    ult: 'UnfoldingWord Literal Text',
    twa: 'Translation Words Article',
    twl: 'Translation Words List',
    glt: 'Gateway Language Literal Text',
    gst: 'Gateway Language Simplified Text',
};

export default function MergeDialog({ onSubmit, onCancel, open, isLoading, loadingProps, mergeStatusForCards }) {
    const [checkedIds, setCheckedIds] = useState([]);

    console.log({ checkedIds, mergeStatusForCards });

    const descriptionRef = useRef(null);

    const handleChange = (event) => {
        const clickedId = event.target.value;
        console.log({ clickedId });
        setCheckedIds((checkedIds) =>
            checkedIds.includes(clickedId)
                ? checkedIds.filter((chekedId) => chekedId !== clickedId)
                : [...checkedIds, clickedId]
        )
    };

    const getFormData = useCallback(() => {
        const description = descriptionRef.current.value;
        onSubmit({ description, mergeableCardIds: checkedIds })
    }, [checkedIds])

    const mergeableCardIds = useMemo(() => {
        let mergeableCardIds = [];
        for (const [key, value] of Object.entries(mergeStatusForCards)) {
            if (value.mergeToMaster.mergeNeeded === true) {
                mergeableCardIds = [...mergeableCardIds, `${key}`]
            }
        }
        console.log({ newMergeStatusForCards: mergeableCardIds });
        return mergeableCardIds;
    }, [mergeStatusForCards]);


    const children = useMemo(() => (
        <>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Mergeable Resources</FormLabel>
                <FormGroup>
                    {mergeableCardIds.map((cardId, index) => (

                        <Box
                            key={index}
                            sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}
                        >
                            <FormControlLabel
                                label={cardNames[cardId]}
                                control={<Checkbox
                                    value={cardId}
                                    checked={checkedIds.includes(cardId)}
                                    onClick={handleChange} />}
                            />
                        </Box>
                    ))
                    }
                </FormGroup>
            </FormControl>
        </>
    ), [checkedIds, mergeableCardIds]);

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
                    onClick={getFormData}
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

MergeDialog.propTypes = {
    /** Current state of preview toggle */
    isLoading: PropTypes.bool,
    loadingProps: PropTypes.any,
    /** Handle click of Preview Button  */
    onSubmit: PropTypes.func.isRequired,
    /** Has the file changed for Save to be enabled */
    open: PropTypes.bool,
    /** Handle click of Save Button */
    onCancel: PropTypes.func.isRequired,
    mergeStatusForCards: PropTypes.object,
};

//proptypes and a file for the dummy data