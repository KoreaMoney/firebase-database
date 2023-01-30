import { dbService } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import DwitterDelEdit from "../components/DwitterDelEdit";
import DwitterFactory from "components/DwitterFactory";

const Home = ({ userObj }) => {
  const [dwitters, setDwitters] = useState([]);

  /**onSnapshot을 사용하기
   * 데이터 실시간 반영
   */
  useEffect(() => {
    const q = query(
      collection(dbService, "dwitters"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const dwitterArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDwitters(dwitterArray);
    });
  }, []);

  return (
    <div>
      <DwitterFactory userObj={userObj} />
      <div>
        {dwitters.map((dwitter) => (
          <DwitterDelEdit
            key={dwitter.id}
            dwitterObj={dwitter}
            isOwner={dwitter.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
