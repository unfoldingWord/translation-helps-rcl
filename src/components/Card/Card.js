import React from "react";
import PropTypes from "prop-types";
// import { Paper } from "@material-ui/core";
import styled from "styled-components";

const Paper = styled.div`
  margin: 20px;
  padding: 10px;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;
  margin-bottom: 50px;
  transition: all 0.2s ease-in-out;
`;

const Card = ({ title, dragRef, dragHandleClassName }) => {
  return (
    <Paper ref={dragRef} className={dragHandleClassName || ""}>
      <div>{title}</div>
      <p>Description</p>
    </Paper>
  );
};

// Card.propTypes = {};

export default Card;
