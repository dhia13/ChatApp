import api from './axiosInstance';

const getContactsList = async () => {
  const contacts = await api
    .get('/contactsList', { withCredentials: true })
    .then((res) => {
      return res.data.contacts;
    })
    .catch((err) => {
      return false;
    });
  return contacts;
};

const addContact = async (id) => {
  try {
    await api.post('/contact', { contactId: id }, { withCredentials: true });
  } catch (error) {
    console.log(error);
  }
};

export { getContactsList, addContact };
