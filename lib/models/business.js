const { Schema, model } = require('mongoose');

const schema = new Schema({
  user_id: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined']
  },
  contact: String,
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  identification: String,
  identification_image: String,
  company_name: String,
  branding: String,
  type_of_business: String,
  business_category: String,
  business_email: String,
  business_contact: String,
  business_number: String,
  tax_number: String,
  legal_name: String,
  payment_method: String,
  bank: String,
  branch: String,
  account_number: String,
  currency: String,
  billing_address: String,
  postcode: String,
  state: String,
  country: String,
  store_name: String,
  store_number: String,
  store_description: String,
  sunday: {
    start: String,
    end: String
  },
  monday: {
    start: String,
    end: String
  },
  tuesday: {
    start: String,
    end: String
  },
  wednesday: {
    start: String,
    end: String
  },
  thursday: {
    start: String,
    end: String
  },
  friday: {
    start: String,
    end: String
  },
  saturday: {
    start: String,
    end: String
  }
});

module.exports = model('Business', schema);
