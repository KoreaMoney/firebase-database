import { dbService, storageService } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject, ref } from "firebase/storage";

const DwitterDelEdit = ({ dwitterObj, isOwner }) => {
  const [edit, setEdit] = useState(false);
  const [newDwitter, setNewDwitter] = useState(dwitterObj.text);

  const dwitterTextRef = doc(dbService, "dwitters", `${dwitterObj.id}`);

  const onDeleteClick = async () => {
    const checkOk = window.confirm("Are you sure? please check Delete");
    if (checkOk) {
      await deleteDoc(dwitterTextRef);
      await deleteObject(ref(storageService, dwitterObj.attachmentUrl));
    }
  };
  const toggleEdit = () => {
    setEdit((prev) => !prev);
  };
  const onEditSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(dwitterTextRef, {
      text: newDwitter,
    });
    setEdit(false);
  };

  const editOnchange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDwitter(value);
  };

  return (
    <div>
      {edit ? (
        <>
          <form onSubmit={onEditSubmit}>
            <input
              type="text"
              placeholder="Edit your Dwitter"
              value={newDwitter}
              required
              onChange={editOnchange}
            />
            <input type="submit" value="update Dwitter" />
          </form>
          <button onClick={toggleEdit}>cancel</button>
        </>
      ) : (
        <>
          <h4>{dwitterObj.text}</h4>
          {dwitterObj.attachmentUrl && (
            <img
              src={dwitterObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="preview"
            />
          )}
          <p>{new Date(dwitterObj.createdAt).toLocaleString()}</p>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Dwitter</button>
              <button onClick={toggleEdit}>Edit Dwitter</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DwitterDelEdit;
