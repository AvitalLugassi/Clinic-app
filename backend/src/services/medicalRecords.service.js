import medicalRecord from '../models/medicalRecord.model.js'; // חובה להוסיף סיומת .js בשיטה החדשה

export const createmedicalRecord = async (recordData) => {
    const newRecord = new medicalRecord(recordData);
    return await newRecord.save();
};

export const getPatientMedicalHistory = async (patientId) => {
    return await medicalRecord.find({ patient_id: patientId }).sort({ createdAt: -1 });
};

export const getmedicalRecordByAppointment = async (appointmentUuid) => {
    return await medicalRecord.findOne({ appointment_uuid: appointmentUuid });
};