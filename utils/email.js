const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1)Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    // host : process.env.EMAIL_HOST,
    //  port : process.env.EMAIL_PORT,
    //secure: true,
    auth: {
      user: "",
      pass: "",
      //user : process.env.EMAIL_USERNAME,
      //pass : process.env.EMAIL_PASSWORD
    },
  });
  //2)Define email options
  const mailOptions = {
    from: "",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  //3)Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
