import { dbService, storageService } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
const DwitterFactory = ({ userObj }) => {
  const [dwitter, setDwitter] = useState("");
  const [fileAttachment, setFileAttachment] = useState("");
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
    <HomeWrapper>
      <HomeFormContainer onSubmit={onSubmit}>
        <HomeDiv>
          <WriteInput
            value={dwitter}
            onChange={onChangeDwitter}
            type="text"
            placeholder="what's on your mind"
            maxLength={120}
            autoFocus
          />
          <HomeSubmit type="submit" value="Enter" />
        </HomeDiv>
        <ImageDiv>
          <HomeImageFile
            type="file"
            accept="image/*"
            onChange={onFileChange}
            ref={fileInput}
          />
        </ImageDiv>
        {fileAttachment && (
          <HomeImagePhotos>
            <HomeImage src={fileAttachment} alt="preview" />
            <HomeClearBtn onClick={onClearAttachment}>Clear Image</HomeClearBtn>
          </HomeImagePhotos>
        )}
      </HomeFormContainer>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const HomeFormContainer = styled.form`
  margin-top: 5%;
`;
const HomeDiv = styled.div`
  margin-bottom: 20px;
`;
const WriteInput = styled.input`
  background-color: black;
  color: white;
  padding-left: 10px;
  font-size: 15px;
  width: 230px;
  height: 50px;
  border-radius: 20px 0 0 20px;
  border: 1px solid #039be5;
  :focus {
    outline: none;
  }
`;
const HomeSubmit = styled.input`
  position: absolute;
  width: 60px;
  height: 50px;
  border-radius: 0 20px 20px 0;
  border: 1px solid #039be5;
  background-color: #039be5;
  color: white;
  &:active {
    background-color: #40c4ff;
  }
`;
const ImageDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const HomeImageFile = styled.input`
  color: #29b6f6;
`;
const HomeImagePhotos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
`;
const HomeImage = styled.img`
  width: 300px;
  height: 150px;
  margin-bottom: 10px;
`;
const HomeClearBtn = styled.button`
  background-color: #039be5;
  color: white;
  width: 255px;
  height: 40px;
  border-radius: 20px;
  font-size: 15px;
  &:active {
    background-color: #40c4ff;
  }
`;

export default DwitterFactory;
