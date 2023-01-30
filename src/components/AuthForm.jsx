import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import styled from "styled-components";
import { SiAiqfome } from "react-icons/si";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const auth = getAuth();
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        /**Create Account */
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        /**LogIn */
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };
  return (
    <>
      <AuthFormContainer onSubmit={onSubmit}>
        <SiAiqfome size={45} className="AuthIcon" />
        <AuthFormInput
          name="email"
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={onChange}
        />
        <AuthFormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <AuthFormSubmit
          type="submit"
          value={newAccount ? "Create Account" : "SigIn"}
        />
        {error}
        <AuthFormSpan onClick={toggleAccount}>
          {newAccount ? "SigIn" : "Create Account"}
        </AuthFormSpan>
      </AuthFormContainer>
    </>
  );
};

const AuthFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40%;
  .AuthIcon {
    color: #039be5;
    margin-bottom: 20px;
  }
`;
const AuthFormInput = styled.input`
  width: 350px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid black;
  :focus {
    outline: none;
  }
  padding-left: 10px;
  margin-bottom: 10px;
`;
const AuthFormSubmit = styled.input`
  color: white;
  background-color: #039be5;
  width: 352px;
  height: 40px;
  font-size: 15px;
  border: 2px solid black;
  border-radius: 20px;
  &:active {
    background-color: #40c4ff;
  }
`;
const AuthFormSpan = styled.span`
  color: #29b6f6;
  width: 400px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  margin-top: 8px;
  &:active {
    color: #80d8ff;
  }
`;

export default AuthForm;
