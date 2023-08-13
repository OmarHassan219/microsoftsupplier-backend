 
require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmail = require("./Utils/sendEmail");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const calculateOrderAmount = (price) => {
    console.log(price);
  return price * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items, price } = req.body;



  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(price),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
    items,
    // metadata: {
    //   orderId: uniqueId, // Attach the unique identifier as m
    // },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// app.get("/", (req, res) => {
//   res.send("welcome to microsoftsupplier website");
// });
app.get("/api/sendemail", (req, res) => {
  res.send("welcome to microsoftsupplier website email");
});




app.post("/api/sendemail", async (req, res) => {
  const { email , companyName, messages } = req.body;
try {
  const send_to = process.env.EMAIL_USER   ;
    const sent_from = process.env.EMAIL_USER      ;
    const reply_to = email;
    const subject = `Asking reagarding buying `;
    const message = `
    <p>Dear MicrosoftSupplier team </p>
    <p>Please click on reply to contact me regarding the GigaSupplier Plan:</p>
    <h5>My Email Address: </h5>
    <p>${email}</p>
    <h5>Company Name : </h5>
    <p>${companyName}</p>
    <p>${messages}</p>
       
    `;

await sendEmail(subject, message, send_to, sent_from, reply_to);
res.status(200).json({ success: true, message: "Email Sent" });
} catch (error) {
  res.status(500).json(error.message);
}
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}`));
