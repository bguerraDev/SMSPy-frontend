// src/components/GradientButton.jsx
import React from "react";
import styled from "styled-components";

const GradientButton = ({ label, onClick, variant = "primary" }) => {
  return (
    <Wrapper variant={variant}>
      <button onClick={onClick}>{label}</button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  z-index: 0;
  overflow: visible;

  button {
    width: 140px;
    height: 45px;
    cursor: pointer;
    color: #000; /* texto negro */
    font-size: 17px;
    font-weight: ${({ variant }) =>
      variant === "primary" ? "700" : "500"}; /* bold si es primary */
    border-radius: 1rem;
    border: none;
    position: relative;
    background: #ffffff; /* fondo blanco */
    transition: 0.1s;
  }

  button::after {
    content: "";
    width: 100%;
    height: 100%;
    background-image: ${({ variant }) =>
      variant === "primary"
        ? `radial-gradient(
          circle farthest-corner at 10% 20%,
          rgba(255, 94, 247, 1) 17.8%,
          rgba(2, 245, 255, 1) 100.2%)`
        : `radial-gradient(
          circle farthest-corner at 10% 20%,
          rgba(0, 153, 255, 0.5) 20%,
          rgba(0, 255, 204, 0.4) 100%)`};
    filter: blur(11px);
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
  }

  button:active {
    transform: scale(0.9) rotate(3deg);
    background: ${({ variant }) =>
      variant === "primary"
        ? `radial-gradient(
          circle farthest-corner at 10% 20%,
          rgba(255, 94, 247, 1) 17.8%,
          rgba(2, 245, 255, 1) 100.2%)`
        : `radial-gradient(
          circle farthest-corner at 10% 20%,
          rgba(0, 153, 255, 0.6) 20%,
          rgba(0, 255, 204, 0.5) 100%)`};
    transition: 0.5s;
  }
`;

export default GradientButton;
