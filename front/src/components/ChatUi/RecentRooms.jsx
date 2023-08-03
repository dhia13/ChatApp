import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleRoom from '../reusables/SingleRoom';
import {
  fetchRecentRooms,
  fetchRecentRoomsWitoutLoading,
} from '../../store/Slices/roomsSlice';
import ListRender from '../reusables/ListRender';
const RecentRooms = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.rooms);
  const id = useSelector((state) => state.user.id);
  useEffect(() => {
    if (rooms.length > 0) {
      dispatch(fetchRecentRoomsWitoutLoading(id));
    } else {
      dispatch(fetchRecentRooms(id));
    }
  }, [dispatch, id, rooms.length]);
  return (
    <ListRender
      loading={loading}
      loadingNumber={rooms.length === 0 ? 7 : rooms.length}
    >
      {rooms.length > 0 ? (
        rooms.map((r) => <SingleRoom room={r} key={r._id} />)
      ) : (
        <p>No Recent Conversations</p>
      )}
    </ListRender>
  );
};

export default RecentRooms;
