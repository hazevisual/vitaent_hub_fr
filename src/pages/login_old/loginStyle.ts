import React from 'react';

const containerStyles: React.CSSProperties = {
  top: '25%',
  position: 'absolute',
  width: '100%',
};

const containerAuth: React.CSSProperties = {
  width:"460px",
  height:"500px",
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  backgroundColor:"#FCFCFC",
  justifyContent: "space-evenly",
  boxShadow: "0px 0px 50px rgba(51,111,238,0.15)",
  borderRadius: "25px"
};

const sp_1: React.CSSProperties = {
  color:"1E1E20",
  fontSize:"36px",
  
};

const sp_2: React.CSSProperties = {
  color:"1E1E20",
  fontSize:"18px",
  opacity:"40%"
};

const b_login : React.CSSProperties = {
  width:"326px",
  height:"38px"
};

const log_in : React.CSSProperties = {
  width:"326px",
  height:"38px"
};

const pass_in : React.CSSProperties = {
  width:"326px",
  height:"38px"
};

export { 
  containerStyles,
  containerAuth,
  sp_1,
  sp_2,
  b_login,
  log_in,
  pass_in
};