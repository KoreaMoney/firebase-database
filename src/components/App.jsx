import React, { useEffect, useState } from "react";
import Routers from "./Routers";
import { getAuth } from "firebase/auth";
import GlobalStyle from "GlobalStyle";

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [userObj, setUserObj] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          user.updateProfile({
            displayName: "Dwitter",
          });
        }
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    setNewDisplayName(userObj.displayName);
  };

  return (
    <>
      <GlobalStyle />
      {init ? (
        <Routers
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default App;
