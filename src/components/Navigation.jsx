import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Navigation = ({ userObj }) => {
  return (
    <NavigationContainer>
      <NavigationNavi>
        <NaviUl>
          <NaviLi>
            <Link to="/">Home</Link>
          </NaviLi>
          <NaviLi>
            <Link to="/profile">{userObj.displayName}의 Profile</Link>
          </NaviLi>
        </NaviUl>
      </NavigationNavi>
    </NavigationContainer>
  );
};
const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 20%;
  margin-top: 50px;
`;
const NavigationNavi = styled.nav``;
const NaviUl = styled.ul`
  flex-direction: row;
  display: flex;
  width: 130%;
  height: 40px;
  gap: 100px;
`;
const NaviLi = styled.li`
  color: #29b6f6;
`;

export default Navigation;
