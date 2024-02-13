const db = require('../models');
const Users = db.users;

const Agents = db.agents;

const Attachments = db.attachments;

const Customers = db.customers;

const Folders = db.folders;

const Mailboxes = db.mailboxes;

const Messages = db.messages;

const TicketCounts = db.ticket_counts;

const TicketLabels = db.ticket_labels;

const Tickets = db.tickets;

const Webhooks = db.webhooks;

const AgentsData = [
  {
    agent_id: 'I got that scurvy',
  },

  {
    agent_id: 'That damn diabetes',
  },

  {
    agent_id: 'That damn Bill Stull',
  },

  {
    agent_id: 'Come on now',
  },
];

const AttachmentsData = [
  {
    attachment_id: 'Like a red-headed stepchild',
  },

  {
    attachment_id: 'That damn diabetes',
  },

  {
    attachment_id: 'Standby',
  },

  {
    attachment_id: 'That damn Bill Stull',
  },
];

const CustomersData = [
  {
    customer_id: 'Always the last one to the party',
  },

  {
    customer_id: 'No one tells me shit',
  },

  {
    customer_id: 'Come on now',
  },

  {
    customer_id: 'That damn diabetes',
  },
];

const FoldersData = [
  {
    folder_id: "That Barbala couldn't fly his way out of a wet paper bag",
  },

  {
    folder_id: "That's messed up",
  },

  {
    folder_id: 'My buddy Harlen',
  },

  {
    folder_id: 'Yup',
  },
];

const MailboxesData = [
  {
    mailbox_id: "Goin' hog huntin'",
  },

  {
    mailbox_id: 'Turd gone wrong',
  },

  {
    mailbox_id: 'Yup',
  },

  {
    mailbox_id: 'No one tells me shit',
  },
];

const MessagesData = [
  {
    message_id: 'Standby',
  },

  {
    message_id: 'Come on now',
  },

  {
    message_id: 'So I was walking Oscar',
  },

  {
    message_id: 'That damn diabetes',
  },
];

const TicketCountsData = [
  {
    count_id: "It's around here somewhere",
  },

  {
    count_id: "Goin' hog huntin'",
  },

  {
    count_id: 'That damn Bill Stull',
  },

  {
    count_id: 'My boss gonna fire me',
  },
];

const TicketLabelsData = [
  {
    label_id: 'Texas!',
  },

  {
    label_id: 'Reminds me of my old girlfriend Olga Goodntight',
  },

  {
    label_id: "Goin' hog huntin'",
  },

  {
    label_id: 'I got that scurvy',
  },
];

const TicketsData = [
  {
    ticket_id: 'My buddy Harlen',
  },

  {
    ticket_id: "That's messed up",
  },

  {
    ticket_id: 'Might be DQ time',
  },

  {
    ticket_id: "C'mon Naomi",
  },
];

const WebhooksData = [
  {
    webhook_id: 'Standby',
  },

  {
    webhook_id: 'I tell you what',
  },

  {
    webhook_id: "Y'all never listen to me",
  },

  {
    webhook_id: 'I want my 5$ back',
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Agents.bulkCreate(AgentsData);

    await Attachments.bulkCreate(AttachmentsData);

    await Customers.bulkCreate(CustomersData);

    await Folders.bulkCreate(FoldersData);

    await Mailboxes.bulkCreate(MailboxesData);

    await Messages.bulkCreate(MessagesData);

    await TicketCounts.bulkCreate(TicketCountsData);

    await TicketLabels.bulkCreate(TicketLabelsData);

    await Tickets.bulkCreate(TicketsData);

    await Webhooks.bulkCreate(WebhooksData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('agents', null, {});

    await queryInterface.bulkDelete('attachments', null, {});

    await queryInterface.bulkDelete('customers', null, {});

    await queryInterface.bulkDelete('folders', null, {});

    await queryInterface.bulkDelete('mailboxes', null, {});

    await queryInterface.bulkDelete('messages', null, {});

    await queryInterface.bulkDelete('ticket_counts', null, {});

    await queryInterface.bulkDelete('ticket_labels', null, {});

    await queryInterface.bulkDelete('tickets', null, {});

    await queryInterface.bulkDelete('webhooks', null, {});
  },
};
