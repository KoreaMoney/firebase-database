import AuthForm from "components/AuthForm";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React from "react";
import styled from "styled-components";
import { AiFillGoogleCircle, AiFillGithub } from "react-icons/ai";

const Auth = () => {
  const auth = getAuth();

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthFormWrapper>
      <AuthForm />
      <SocialWrapper>
        <GoogleBtn name="google" onClick={onSocialClick}>
          Google Login
          <AiFillGoogleCircle size={20} />
        </GoogleBtn>
        <GithubBtn name="github" onClick={onSocialClick}>
          Github Login
          <AiFillGithub size={20} />
        </GithubBtn>
      </SocialWrapper>
    </AuthFormWrapper>
  );
};
const AuthFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 500px;
  height: 30vh;
`;

const SocialWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;
const GoogleBtn = styled.button`
  width: 170px;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  &:hover {
    border: 3px solid #039be5;
  }
  &:active {
    background-color: #039be5;
  }
`;
const GithubBtn = styled.button`
  width: 170px;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  &:hover {
    border: 3px solid #039be5;
  }
  &:active {
    background-color: #039be5;
  }
`;

export default Auth;
