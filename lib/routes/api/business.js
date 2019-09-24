const Business = require('../../models/business');
const Currency = require('../../models/currency');
const Bank = require('../../models/bank');
const PaymentMethod = require('../../models/payment-method');
const Category = require('../../models/business-category');
const Types = require('../../models/business-type');

module.exports = {
  getBusinesses: async (req, res) => {
    const businesses = await Business.find({});
    return res.ok('Businesses received', {
      businesses: businesses
    });
  },
  registerBusiness: async (req, res) => {
    const {
      merchant_id,
      contact,
      f_name,
      l_name,
      email,
      identification,
      identification_image,
      company_name,
      branding,
      type_of_business,
      business_category,
      business_email,
      business_contact,
      business_number,
      tax_number,
      legal_name,
      payment_method,
      bank,
      branch,
      account_number,
      currency,
      billing_address,
      postcode,
      state,
      country
    } = req.body;


    const newBusiness = {
      merchant_id,
      contact,
      f_name,
      l_name,
      email,
      identification,
      identification_image,
      company_name,
      branding,
      type_of_business,
      business_category,
      business_email,
      business_contact,
      business_number,
      tax_number,
      legal_name,
      payment_method,
      bank,
      branch,
      account_number,
      currency,
      billing_address,
      postcode,
      state,
      country,
      isPending: true,
      isApproved: false,
      isDeclined: false,
      store_name: '',
      store_number: '',
      store_description: '',
      sunday: {
        start: '',
        end: ''
      },
      monday: {
        start: '',
        end: ''
      },
      tuesday: {
        start: '',
        end: ''
      },
      wednesday: {
        start: '',
        end: ''
      },
      thursday: {
        start: '',
        end: ''
      },
      friday: {
        start: '',
        end: ''
      },
      saturday: {
        start: '',
        end: ''
      }
    };


    const business = await Business.create(newBusiness);
    return res.ok('Successfully created the business request.', {
      business: business
    });
  },
  getBusinessRegistrationInformation: async (req, res) => {
    const info = {
      currency: await Currency.find({}),
      payment_method: await PaymentMethod.find({}),
      bank: await Bank.find({}),
      business_category: await Category.find({}),
      business_type: await Types.find({})
    };

    return res.ok('Businesses registration information received', {
      info: info
    });
  },
  approveBusiness: async (req, res) => {
    const { _id } = req.body;

    const update = {
      isPending: false,
      isApproved: true
    };

    await Business.updateOne({ _id }, update);
    return res.ok('Business Approved.');
  },
  declineBusiness: async (req, res) => {
    const { _id } = req.body;

    const update = {
      isPending: false,
      isDeclined: true
    };

    const business = await Business.updateOne({ _id }, update);
    return res.ok('Business Declined.', {
      business: business
    });
  },
  updateBusinessInfo: async (req, res) => {
    const {
      _id,
      store_name,
      store_number,
      store_description,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday
    } = req.body;

    const update = {
      store_name,
      store_number,
      store_description,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday
    };

    await Business.updateOne({ _id }, update);
    return res.ok('Business Information Updated.');
  },
  getBusinessTypes2: async (req, res) => {
    const types = await Types.find({});

    const businesses = await Business.find({});
    return res.ok('Categories received', {
      categories: types,
      businesses: businesses
    });
  }
};