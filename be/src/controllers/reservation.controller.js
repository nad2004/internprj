import * as reservationService from '../services/reservation.service.js';
import { respondSuccess } from '../utils/respond.js';
export const create = async (req, res, next) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    respondSuccess(res, { data: reservation });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const reservations = await reservationService.getReservations();
    respondSuccess(res, { data: reservations });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { data: reservation });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.id, req.body);
    if (!reservation) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { data: reservation });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const reservation = await reservationService.deleteReservation(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { message: 'Reservation deleted successfully' });
  } catch (err) {
    next(err);
  }
};
