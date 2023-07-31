import React, { useEffect } from 'react';
import { fetchContacts } from '../../store/Slices/contactsSlice';
import { useDispatch, useSelector } from 'react-redux';

const NewChat = () => {
  const dispatch = useDispatch();
  const { contactsList, loading, error } = useSelector(
    (state) => state.contacts
  );
  useEffect(() => {
    if (!contactsList) {
      dispatch(fetchContacts());
    }
  }, [dispatch]);
  console.log(contactsList);
  return (
    <div>
      {contactsList.map((s) => (
        <p>{s.username}</p>
      ))}
    </div>
  );
};

export default NewChat;
