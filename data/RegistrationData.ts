import { generateRegistrationData } from '../helpers/DataGenerator';

const dynamicData = generateRegistrationData();

export const emailData = dynamicData.email;
export const firstNameData = dynamicData.firstName;
export const lastNameData = dynamicData.lastName;
export const passwordData = dynamicData.password;
export const repeatPasswordData = dynamicData.repeatPassword;
export const successfulMessage = "Please check your email for your Activation Button. Click it and you'll come right back here and be able to start registering immediately.";
