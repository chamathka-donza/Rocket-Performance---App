import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    date: {type: String, required: true},
    vehicleNo:{type: String, required: true},
    timePeriod: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
}, {
    timestamps: true,
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;