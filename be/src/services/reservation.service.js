import Reservation from '../models/Reservation.js';

export const createReservation = async (data) => {
  return await Reservation.create(data);
};

export const getReservations = async (filter = {}) => {
  return await Reservation.find(filter)
    .populate('user_id', 'username email')
    .populate('book_id', 'title authors');
};

export const getReservationById = async (id) => {
  return await Reservation.findById(id)
    .populate('user_id', 'username email')
    .populate('book_id', 'title authors');
};

export const updateReservation = async (id, data) => {
  return await Reservation.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReservation = async (id) => {
  return await Reservation.findByIdAndDelete(id);
};
