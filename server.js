const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const accountSid = 'AC71afc4eb0d20c83c47372df1c2d6e83d';
const authToken = '24bd62f74d87889743f350b307362c2f';
const senderPhoneNum = '+13134668519';
const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/sms-promotion', (req, res) => {
    const data = req.body;
    const phoneNum = data.phone.trim();

    let response = {
        status: 'danger',
        message: 'Missed required params'
    }

    if(data.over18 && data.acceptTerms && phoneNum){
        const hour = new Date().getHours();
        let textMsg = 'Hello! Your promocode is PM456';

        if(hour < 12){
            textMsg = 'Good morning! Your promocode is AM123';
        }

        client.messages
            .create({
                to: phoneNum,
                from: senderPhoneNum,
                body: textMsg
            })
            .then(message => {
                response = {
                    status: 'success',
                    message: 'You will receive a SMS in a while',
                    data: message
                }

                res.send(response);
            })
            .catch(message => {
                response = {
                    status: 'danger',
                    message: 'The phone number is incorrect or service is down',
                    data: message
                }

                res.send(response);
            });
    } else {
        res.send(response);
    }
});

app.listen(port);