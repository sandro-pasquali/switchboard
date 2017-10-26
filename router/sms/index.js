'use strict';

let env = require('../../config');
let twilio = require('twilio');
let twilioAPI = twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

module.exports = function(server, dbApi) {
		
	let smsUrl = env.URL + '/smswebhook';

	// Set up the webhook on Twilio. If it doesn't succeed the bound
	// route will never be called.
	//
	twilioAPI.incomingPhoneNumbers(env.TWILIO_PHONE_NUMBER_SID).update({
		smsUrl: smsUrl
	});	
	
	server.post('/smswebhook', (req, res) => {
	
		let dat = req.body;

		let meta = {
			message		: dat.Body,
			received	: Date.now(),
			fromCountry	: dat.FromCountry,
			phoneNumber	: dat.From
		};
		
		dbApi
		.addToNumberHistory(dat.From, meta)
		.then(newVal => console.log('Received message from', dat.From))
		.catch(err => console.log("levelERRR:", err));
		
		res.end();
	});
};

/*

twilio post body sent to hook

 ToCountry: 'US',
 ToState: 'NY',
 SmsMessageSid: 'SMe0ee076980526af21e93cbb1074b4371',
 NumMedia: '0',
 ToCity: 'SOUTH RICHMOND HILL',
 FromZip: '11575',
 SmsSid: 'SMe0ee076980526af21e93cbb1074b4371',
 FromState: 'NY',
 SmsStatus: 'received',
 FromCity: 'SOUTH RICHMOND HILL',
 Body: 'Ho',
 FromCountry: 'US',
 To: '+13479604874',
 ToZip: '11435',
 NumSegments: '1',
 MessageSid: 'SMe0ee076980526af21e93cbb1074b4371',
 AccountSid: 'ACb654b198d890e14869d7839697365347',
 From: '+19177674492',
 ApiVersion: '2010-04-01' }

*/