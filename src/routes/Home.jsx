import { dbService, storageService } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import DwitterDelEdit from "../components/DwitterDelEdit";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [dwitter, setDwitter] = useState("");
  const [dwitters, setDwitters] = useState([]);
  const [fileAttachment, setFileAttachment] = useState("");
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
  /**addDoc사용하기
   * 데이터 추가하기
   * 1. 이미지 첨부하지 않고 텍스트만 올리고 싶을 때도 있기 때문에 attachment가 있을때만 아래 코드 실행
   * 2.이미지 첨부하지 않은 경우엔 attachmentUrl=""이 된다.
   * 3. 파일 경로 참조 만들기
   * 4. storage 참조 경로로 파일 업로드 하기
   * 5. storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
   */

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (fileAttachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, fileAttachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const dwitterOdjArray = {
      text: dwitter,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "dwitters"), dwitterOdjArray);
    setDwitter("");
    setFileAttachment("");
  };

  /**데이터 변화 시 변화된 onChage하기 */
  const onChangeDwitter = (event) => {
    const {
      target: { value },
    } = event;
    setDwitter(value);
  };

  /**사진 null값에서 변화주기 */
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    /**file reader API
     * https://developer.mozilla.org/ko/docs/Web/API/FileReader
https://developer.mozilla.org/en-US/docs/Web/API/FileReader/onload
     */
    /**사진 string읽어내기 */
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setFileAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  /**사진 clear하기 */
  const fileInput = useRef();
  const onClearAttachment = () => {
    /** 1. 첨부파일 url 넣는 state 비워서 프리뷰 img src 없애기
     * 2. 선택했던 첨부파일명 없애기
     */
    setFileAttachment("");
    fileInput.current.value = null;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={dwitter}
          onChange={onChangeDwitter}
          type="text"
          placeholder="what's on your mind"
          maxLength={120}
          autoFocus
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Dwitter" />
        {fileAttachment && (
          <div>
            <img
              src={fileAttachment}
              alt="preview"
              width="50px"
              height="50px"
            />
            <button onClick={onClearAttachment}>Clear Image</button>
          </div>
        )}
      </form>
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
