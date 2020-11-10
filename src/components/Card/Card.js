import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Badge from "@material-ui/core/Badge";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const useStyles = makeStyles(() => ({
  dragIcon: {
    color: "gray",
    opacity: 0.5,
    margin: "0px 10px 0px 0px",
    cursor: (props) => (props.dragging ? "grabbing" : "grab"),
  },
  pointerIcon: {
    cursor: "pointer",
  },
  children: {
    padding: "0px 0px 0px 4px",
  },
  paddingRight: {
    padding: "0px 13px 0px 0px",
  },
}));

const Paper = styled.div`
  margin: 2.5px;
  padding: 13px;
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

const Card = ({
  alert,
  title,
  center,
  dragRef,
  onClose,
  dragging,
  children,
  closeable,
  classes: { root, header, children: childrenClassName },
}) => {
  const classes = useStyles({ dragging });

  const onAlertClick = () => {
    console.log("onAlertClick");
  };

  const onMenuClick = () => {
    console.log("onMenuClick");
  };

  return (
    <Paper ref={dragRef} className={root}>
      <FlexSpacedDiv className={header}>
        <FlexDiv>
          <DragIndicatorIcon className={classes.dragIcon} />
          <div>{title}</div>
        </FlexDiv>
        <FlexDiv>{center}</FlexDiv>
        {closeable ? (
          <CloseIcon className={classes.pointerIcon} onClick={onClose} />
        ) : (
          <FlexDiv>
            {alert && (
              <div
                className={`${classes.pointerIcon} ${classes.paddingRight}`}
                onClick={onAlertClick}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  // invisible={invisible}
                >
                  <AnnouncementIcon />
                </Badge>
              </div>
            )}
            <MoreHorizIcon
              className={classes.pointerIcon}
              onClick={onMenuClick}
            />
          </FlexDiv>
        )}
      </FlexSpacedDiv>
      <div className={`${classes.children} ${childrenClassName}`}>
        {children}
      </div>
    </Paper>
  );
};

Card.defaultProps = {
  classes: {
    root: "",
    header: "",
    children: "",
  },
  alert: false,
  dragging: false,
  closeable: false,
};

Card.propTypes = {
  /** Root ref, used as reference for drag action */
  dragRef: PropTypes.node,
  /** Show alert icon */
  alert: PropTypes.bool,
  /** Show dragging icon when card is dragged */
  dragging: PropTypes.bool,
  /** Show close (x) icon instead of three dot menu icon */
  closeable: PropTypes.bool,
  /** Class names to modify the root, header and children */
  classes: PropTypes.object,
  /** JSX to be render in the center of the card header */
  center: PropTypes.node.isRequired,
  /** JSX text for the title */
  title: PropTypes.node.isRequired,
  /** Function fired when the close (x) icon is clicked */
  onClose: PropTypes.func.isRequired,
  /** Content/jsx render in the body of the card */
  children: PropTypes.node.isRequired,
};

export default Card;
