// src/components/RoutineForm/utils.js
export const validateTrainingPackCode = (code) => {
    const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return code && !regex.test(code) ? 'Invalid format. Use XXXX-XXXX-XXXX-XXXX' : '';
};
