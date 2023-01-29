import { dbService } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const auth = getAuth();
  const onLogOutClick = () => {
    auth.signOut();
  };
  /**내가 쓴 글 가져오기 */
  const getMyDwitter = async () => {
    const q = query(
      collection(dbService, "dwitters"),
      where("creatorId", "==", `${userObj.uid}`),
      orderBy("createdAt", "desc")
    );
    const querySnapShot = await getDocs(q);
    querySnapShot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  useEffect(() => {
    getMyDwitter();
  }, []);

  const onChangeDisplayName = (event) => {
    setNewDisplayName(event.target.value);
  };

  const displayNameOnsubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={displayNameOnsubmit}>
        <input
          type="text"
          placeholder="Display Name"
          onChange={onChangeDisplayName}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <Link to="/">
        <button onClick={onLogOutClick}>LogOut</button>
      </Link>
    </>
  );
};
export default Profile;
