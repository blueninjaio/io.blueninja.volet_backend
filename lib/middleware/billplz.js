const HmacSHA256 = require('crypto-js/hmac-sha256');
const Hex = require('crypto-js/enc-hex');
const fetch = require('node-fetch');
const { billplz, local_endpoint } = require('../config');
const { BillPlzBill } = require('../models');

module.exports = {
    validateCallback: async (id, collection_id, paid, state, amount, paid_amount, due_at, email, mobile, name, url, paid_at, x_signature) => {
        let object = { id, collection_id, paid, state, amount, paid_amount, due_at, email, mobile, name, url, paid_at };
        let values = [];
        for (let key in object) {
            values.push(key + object[key]);
        }
        let xsignatureParam = values.sort().join('|');
        let sha256 = HmacSHA256(xsignatureParam, billplz.x_signature_key);
        if (x_signature !== Hex.stringify(sha256)) {
            return false;
        }
        let bill = await BillPlzBill.findOne({ bill_id: id });
        if (!bill) {
            return false;
        }
        let user = await User.findOne({ _id: bill.user });
        if (!user) {
            return false;
        }
        return user;
    },
    createBill: async (user, amount, description, redirect_url) => {
        let result = await fetch(`${billplz.endpoint}/bills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Accept': "application/json",
                    'Authorization': 'Basic ' + Buffer.from(`${billplz.secret}:`).toString('base64')
                },
                body: JSON.stringify({
                    collection_id: billplz.collection_id,//	The collection ID. A string.
                    email: user.email,//	The email address of the bill’s recipient. (Email is required if mobile is not present.)
                    mobile: user.contact,//	Recipient’s mobile number. Be sure that all mobile numbers include country code, area code and number without spaces or dashes. (e.g., +60122345678 or 60122345678). Use Google libphonenumber library to help. Mobile is required if email is not present.
                    name: user.f_name + " " + user.l_name,//	Bill’s recipient name. Useful for identification on recipient part. (Max of 255 characters)
                    amount: amount,//	A positive integer in the smallest currency unit (e.g 100 cents to charge RM 1.00)
                    callback_url: `${local_endpoint}/payment/billplz`,//	Web hook URL to be called after payment’s transaction completed. It will POST a Bill object.
                    description: description,//	The bill's description. Will be displayed on bill template. String format. (Max of 200 characters)
                    //OPTIONAL ARGUMENTS
                    //due_at: ,//	Due date for the bill. The format YYYY-MM-DD, default value is today. Year range is 19xx to 2xxx
                    redirect_url: redirect_url,//	URL to redirect the customer after payment completed. It will do a GET to redirect_url together with bill’s status and ID.
                    //deliver: ,//	Boolean value to set email and SMS (if mobile is present) delivery. Default value is false.
                    //reference_1_label: ,//	Label #1 to reconcile payments (Max of 20 characters) Default value is Reference 1
                    //reference_1: ,//	Value for reference_1_label (Max of 120 characters)
                    //reference_2_label: ,//	Label #2 to reconcile payments (Max of 20 characters) Default value is Reference 2
                    //reference_2: //	Value for reference_2_label (Max of 120 characters)
                })
            }
        );
        result = await result.json();
        if (result.error) {
            throw Error(result.error.message);
        }
        await BillPlzBill.create({
            user: user._id,
            bill_id: result.id
        });
        return result;
    }
};