'use strict';

let Promise = require('bluebird');
let env = require('../../config');
let Twilio = require('twilio');
let twilioAPI = new Twilio(env.TWILIO_SID, env.TWILIO_AUTH_TOKEN);

module.exports = (number, message) => {

	return twilioAPI.messages.create({
		to: number,
		from: env.TWILIO_DEFAULT_FROM,
		body: message
	})
};
