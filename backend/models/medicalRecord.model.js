import mongoose from 'mongoose'; // שימוש ב-import במקום require

const medicalRecordSchema = new mongoose.Schema({
    appointment_uuid: {
        type: String,
        required: true,
        unique: true
    },
    patient_id: {
        type: Number,
        required: true
    },
    doctor_id: {
        type: Number,
        required: true
    },
    visit_summary: {
        type: String,
        required: true
    },
    diagnoses: [
        {
            code: String,
            description: String
        }
    ],
    prescriptions: [
        {
            medicine_name: String,
            dosage: String,
            duration: String
        }
    ],
    referrals: [
        {
            target_specialty: String,
            reason: String
        }
    ]
}, {
    timestamps: true
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;