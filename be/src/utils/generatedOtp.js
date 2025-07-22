import otpGenerator from 'otp-generator';

const generatedOtp = () => {
  return otpGenerator
    .generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })
    .toString();
};
export default generatedOtp;
