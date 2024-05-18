import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: String,
    comment: String
});

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    img: String,
    registrations: [registrationSchema]
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
