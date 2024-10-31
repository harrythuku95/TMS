const config = require('../../config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.sendgridApiKey);

module.exports = class EmailSender {
  constructor(to, subject, text, html) {
    this.to = to;
    this.subject = subject;
    this.text = text;
    this.html = html;
  }

  async send() {
    const msg = {
      to: this.to,
      from: config.emailFrom,
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
    await sgMail.send(msg);
  }

  static get isConfigured() {
    return !!config.sendgridApiKey;
  }
};
