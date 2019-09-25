const fetch = require('node-fetch');
const { username, password, type, sender_id } = require("../config").isms;

module.exports = {
    sendSMS: async (number, message) => {
        let result = await fetch(`http://www.isms.com.my/isms_send.php?un=${username}&pwd=${password}&type=${type}&sendid=${sender_id}&dstno=${number}&msg=${message}&agreedterm=YES`, {
                method: "GET",
                headers: {
                    'Accept': "application/text",
                    'Accept-Encoding': 'identity'
                }
            }
        );
        let data = await result.text();
        let index = data.indexOf('=');
        let code = parseInt(data.substr(0, index).trim());
        let msg = data.substr(index + 1).trim();
        if (code !== 2000) {
            throw new Error(msg);
        }
    }
};