import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const useStyles = makeStyles(() => ({
  dragIcon: {
    color: "gray",
    opacity: 0.5,
    margin: "0px 10px 0px 0px",
    cursor: (props) => (props.dragging ? "grabbing" : "grab"),
  },
  moreIcon: {
    cursor: "pointer",
  },
}));

const Paper = styled.div`
  margin: 20px;
  padding: 10px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;
  margin-bottom: 50px;
  transition: all 0.2s ease-in-out;
`;

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

const FlexSpacedDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Card = ({ title, dragRef, dragHandleClassName, dragging }) => {
  const classes = useStyles({ dragging });

  return (
    <Paper ref={dragRef} className={dragHandleClassName || ""}>
      <FlexSpacedDiv>
        <FlexDiv>
          <DragIndicatorIcon className={classes.dragIcon} />
          <div>{title}</div>
        </FlexDiv>
        <MoreHorizIcon className={classes.moreIcon} />
      </FlexSpacedDiv>
      <p>Description</p>
    </Paper>
  );
};

Card.defaultProps = {
  dragging: false,
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  dragging: PropTypes.bool,
  dragRef: PropTypes.node.isRequired,
  dragHandleClassName: PropTypes.string.isRequired,
};

export default Card;
