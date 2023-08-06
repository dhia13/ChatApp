import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContacts,
  fetchContactsWitouLoading,
} from '../../store/Slices/contactsSlice';
import ListRender from '../reusables/ListRender';
import SingleContact from '../reusables/SingleContact';
const Contacts = () => {
  const dispatch = useDispatch();
  const { contactsList, loading } = useSelector((state) => state.contacts);
  useEffect(() => {
    if (contactsList.length > 0) {
      dispatch(fetchContactsWitouLoading());
    } else {
      dispatch(fetchContacts());
    }
  }, [contactsList.length, dispatch]);
  return (
    <ListRender
      loading={loading}
      loadingNumber={contactsList.length === 0 ? 7 : contactsList.length}
    >
      <div className="w-full h-full justify-start items-center flex flex-col gap-2 bg-cyan-500">
        {contactsList?.length > 0 ? (
          contactsList.map((contact) => (
            <SingleContact contact={contact} key={contact.id} />
          ))
        ) : (
          <div className="w-full h-full justify-center items-center flex">
            No Contacts
          </div>
        )}
      </div>
    </ListRender>
  );
};

export default Contacts;
