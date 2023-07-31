// socketUtils.js

async function emitOnlineStatusToContacts(
  socketMap,
  contacts,
  userId,
  isOnline
) {
  try {
    for (const contactId of contacts) {
      const contactIdString = contactId.toString();
      const contactSocket = socketMap.get(contactIdString);
      if (contactSocket) {
        console.log(
          `user with id ${userId} is online sending status to ${contactId} via ${contactSocket.id} socket`
        );
        contactSocket.emit('isOnline', { id: userId, online: isOnline });
      }
    }
  } catch (error) {
    console.error('Error emitting online status to contacts:', error);
  }
}

module.exports = { emitOnlineStatusToContacts };
