const verifyEmailTemplate = ({ name, otp }) => {
  return `
<p>Chào ${name}</p>    
<p>Đây là mã OTP cho tài khoản của bạn</p>   
<div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
        ${otp}
    </div>
    <p>This otp is valid for 1 min only.</p>
`;
};

export default verifyEmailTemplate;
