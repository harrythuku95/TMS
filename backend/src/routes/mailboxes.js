const express = require('express');

const MailboxesService = require('../services/mailboxes');
const MailboxesDBApi = require('../db/api/mailboxes');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

const { parse } = require('json2csv');

const { checkCrudPermissions } = require('../middlewares/check-permissions');

router.use(checkCrudPermissions('mailboxes'));

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Mailboxes:
 *        type: object
 *        properties:
 *          mailbox_id:
 *            type: string
 *            default: mailbox_id
 *          name:
 *            type: string
 *            default: name
 *          type:
 *            type: string
 *            default: type
 */

/**
 *  @swagger
 * tags:
 *   name: Mailboxes
 *   description: The Mailboxes managing API
 */

/**
 *  @swagger
 *  /api/mailboxes:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Add new item
 *      description: Add new item
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Mailboxes"
 *      responses:
 *        200:
 *          description: The item was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Mailboxes"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */

router.post(
  '/',
  wrapAsync(async (req, res) => {
    await MailboxesService.create(
      req.body.data,
      req.currentUser,
      true,
      req.headers.referer,
    );
    const payload = true;
    res.status(200).send(payload);
  }),
);

router.post(
  '/bulk-import',
  wrapAsync(async (req, res) => {
    await MailboxesService.bulkImport(req, res, true, req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/mailboxes/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Update the data of the selected item
 *      description: Update the data of the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new item data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated item
 *                  type: string
 *                data:
 *                  description: Data of the updated item
 *                  type: object
 *                  $ref: "#/components/schemas/Mailboxes"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The item data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Mailboxes"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    await MailboxesService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/mailboxes/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Delete the selected item
 *      description: Delete the selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Item ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The item was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Mailboxes"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    await MailboxesService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/mailboxes:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Get all mailboxes
 *      description: Get all mailboxes
 *      responses:
 *        200:
 *          description: Mailboxes list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Mailboxes"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const filetype = req.query.filetype;
    const payload = await MailboxesDBApi.findAll(req.query);
    if (filetype && filetype === 'csv') {
      const fields = ['id', 'mailbox_id', 'name', 'type'];
      const opts = { fields };
      try {
        const csv = parse(payload.rows, opts);
        res.status(200).attachment(csv);
        res.send(csv);
      } catch (err) {
        console.error(err);
      }
    } else {
      res.status(200).send(payload);
    }
  }),
);

/**
 *  @swagger
 *  /api/mailboxes/count:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Count all mailboxes
 *      description: Count all mailboxes
 *      responses:
 *        200:
 *          description: Mailboxes count successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Mailboxes"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get(
  '/count',
  wrapAsync(async (req, res) => {
    const payload = await MailboxesDBApi.findAll(req.query, {
      countOnly: true,
    });

    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/mailboxes/autocomplete:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Find all mailboxes that match search criteria
 *      description: Find all mailboxes that match search criteria
 *      responses:
 *        200:
 *          description: Mailboxes list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Mailboxes"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */
router.get('/autocomplete', async (req, res) => {
  const payload = await MailboxesDBApi.findAllAutocomplete(
    req.query.query,
    req.query.limit,
  );

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/mailboxes/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Mailboxes]
 *      summary: Get selected item
 *      description: Get selected item
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of item to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected item successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Mailboxes"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Item not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await MailboxesDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
