import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware";
import ClientController from "../controllers/ClientController";

const clientRoute = express.Router();
const clientController = new ClientController();

// CLIENT ROUTES

/**
 * @swagger
 * /api/client/:
 *   post:
 *     summary: Create A New Client
 *     tags: [Client Management]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The Firstname of the Client
 *                 example: "Juan"
 *               lastname:
 *                 type: string
 *                 description: The Lastname of the Client
 *                 example: "Dela Cruz"
 *               companyName:
 *                 type: string
 *                 description: The Name of the Company
 *                 example: "Lightweight Solutions"
 *               email:
 *                 type: string
 *                 description: The Email Address of the Client
 *                 example: "juan@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The Phone Number of the Client
 *                 example: "123-456-7890"
 *               businessPhone:
 *                 type: string
 *                 description: The Business Phone of the Client
 *                 example: "098-765-4321"
 *               mobilePhone:
 *                 type: string
 *                 description: The Mobile Phone of the Client
 *                 example: "321-654-0987"
 *               address:
 *                 type: string
 *                 description: The Address of the Company
 *                 example: "123 Main Street, Cityville"
 *             required:
 *               - firstname
 *               - lastname
 *               - companyName
 *     responses:
 *       201:
 *         description: Successfully Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 firstname:
 *                   type: string
 *                   example: "Juan"
 *                 lastname:
 *                   type: string
 *                   example: "Dela Cruz"
 *                 companyName:
 *                   type: string
 *                   example: "Lightweight Solutions"
 *                 email:
 *                   type: string
 *                   example: "juan@example.com"
 *                 phoneNumber:
 *                   type: string
 *                   example: "123-456-7890"
 *                 businessPhone:
 *                   type: string
 *                   example: "098-765-4321"
 *                 mobilePhone:
 *                   type: string
 *                   example: "321-654-0987"
 *                 address:
 *                   type: string
 *                   example: "123 Main Street, Cityville"
 *                 message:
 *                   type: string
 *                   example: "Successfully Created!."
 *                 code:
 *                   type: integer
 *                   example: 201
 *       403:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Credentials!"
 *                 code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.post("/", authMiddleware, clientController.create);


/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Update An Existing Client
 *     tags: [Client Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Client to be Updated
 *         schema:
 *           type: integer
 *           example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The Firstname of the Client
 *                 example: "Juan"
 *               lastname:
 *                 type: string
 *                 description: The Lastname of the Client
 *                 example: "Dela Cruz"
 *               companyName:
 *                 type: string
 *                 description: The Name of the Company
 *                 example: "Lightweight Solutions"
 *               email:
 *                 type: string
 *                 description: The Email Address of the Client
 *                 example: "juandelacruz@example.com"
 *               phoneNumber:
 *                 type: string
 *                 description: The Phone Number of the Client
 *                 example: "09485738475"
 *               businessPhone:
 *                 type: string
 *                 description: The Business Phone of the Client
 *                 example: "09586495435"
 *               mobilePhone:
 *                 type: string
 *                 description: The Mobile Phone of the Client
 *                 example:
 *               address:
 *                 type: string
 *                 description: The Address of the Client
 *                 example: "Quezon City"
 *             required:
 *               - firstname
 *               - lastname
 *               - companyName
 *     responses:
 *       201:
 *         description: Successfully Updated!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 4
 *                 firstname:
 *                   type: string
 *                   example: "Arjay"
 *                 lastname:
 *                   type: string
 *                   example: "Tebia"
 *                 companyName:
 *                   type: string
 *                   example: "Lightweight Solutions"
 *                 email:
 *                   type: string
 *                   example: "lightweightsolutions@gmail.com"
 *                 phoneNumber:
 *                   type: string
 *                   example: "09485738475"
 *                 businessPhone:
 *                   type: string
 *                   example: "09586495435"
 *                 mobilePhone:
 *                   type: string
 *                   example: ""
 *                 address:
 *                   type: string
 *                   example: "Quezon City"
 *                 message:
 *                   type: string
 *                   example: "Successfully Updated!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       403:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation Error: Missing Required Fields"
 *                 code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.put("/:id", authMiddleware, clientController.update);


/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Delete A Client By ID
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the Client to Delete
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully Deleted The Client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Successfully Deleted!
 *                 code:
 *                   type: integer
 *                   example: 200
 *       403:
 *         description: Failed To Delete The Client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Failed To Delete!
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: An Unexpected Error Occurred.
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.delete("/:id", authMiddleware, clientController.delete);

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Retrieve a List of Clients w/Search and Pagination
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         description: Search keyword to filter clients by fields such as firstname, lastname, companyName, email, phoneNumber, etc.
 *         schema:
 *           type: string
 *           example: "Lightweight"
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Number of clients to retrieve per page
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: A list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 8
 *                           firstname:
 *                             type: string
 *                             example: "Juan"
 *                           lastname:
 *                             type: string
 *                             example: "Dela Cruz"
 *                           email:
 *                             type: string
 *                             example: "juandelacruz@example.com"
 *                           companyName:
 *                             type: string
 *                             example: "Lightweight Solutions"
 *                           phoneNumber:
 *                             type: string
 *                             example: "09485738475"
 *                           businessPhone:
 *                             type: string
 *                             nullable: true
 *                             example: "09586495435"
 *                           mobilePhone:
 *                             type: string
 *                             nullable: true
 *                             example: ""
 *                           address:
 *                             type: string
 *                             example: "Quezon City"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-11-25T06:33:34.089Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-11-25T07:29:38.820Z"
 *                           deletedAt:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                     totalClients:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Result!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.get("/", authMiddleware, clientController.list);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Retrieve a Specific Client's Details By ID
 *     tags: [Client Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client to retrieve
 *         schema:
 *           type: integer
 *           example: 8
 *     responses:
 *       200:
 *         description: Successfully retrieved client details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 8
 *                         firstname:
 *                           type: string
 *                           example: "Juan"
 *                         lastname:
 *                           type: string
 *                           example: "Dela Cruz"
 *                         email:
 *                           type: string
 *                           example: "juandelacruz@example.com"
 *                         companyName:
 *                           type: string
 *                           example: "Lightweight Solutions"
 *                         phoneNumber:
 *                           type: string
 *                           example: "09485738475"
 *                         businessPhone:
 *                           type: string
 *                           nullable: true
 *                           example: "09586495435"
 *                         mobilePhone:
 *                           type: string
 *                           nullable: true
 *                           example: ""
 *                         address:
 *                           type: string
 *                           example: "Quezon City"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-25T06:33:34.089Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-11-25T07:29:38.820Z"
 *                         deletedAt:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                 message:
 *                   type: string
 *                   example: "Successfully Retrived!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       403:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Failed To Retrieve!"
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.get("/:id", authMiddleware, clientController.get);


// INVOICES ROUTES

/**
 * @swagger
 * /api/client/create-invoices/{id}:
 *   post:
 *     summary: Create Multiple Invoices for a Specific Client By ID
 *     tags: [Client and Invoice Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the client to associate the invoices with
 *         schema:
 *           type: integer
 *           example: 6
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     description:
 *                       type: string
 *                       example: "Website Development"
 *                     rate:
 *                       type: number
 *                       example: 500
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Successfully Created Invoice/s
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoices:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           example: 2
 *                 message:
 *                   type: string
 *                   example: "Successfully Created!"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       403:
 *         description: Invalid Inputs or Client Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Invalid Inputs!"
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.post("/create-invoices/:id", authMiddleware, clientController.createMany);


/**
 * @swagger
 * /api/client/update-invoice/{id}:
 *   put:
 *     summary: Update an existing invoice by Invoice ID
 *     tags: [Client and Invoice Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the invoice to update
 *         schema:
 *           type: integer
 *           example: 37
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Technical Support"
 *               rate:
 *                 type: number
 *                 example: 21000
 *               quantity:
 *                 type: number
 *                 example: 1
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-25T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Successfully Updated the Invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 37
 *                     invoiceNumber:
 *                       type: string
 *                       example: "LWS-24-0004"
 *                     clientId:
 *                       type: integer
 *                       example: 8
 *                     description:
 *                       type: string
 *                       example: "Technical Support"
 *                     rate:
 *                       type: string
 *                       example: "21000"
 *                     quantity:
 *                       type: string
 *                       example: "1"
 *                     lineTotal:
 *                       type: string
 *                       example: "21000"
 *                     issuedDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T08:49:49.131Z"
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-25T00:00:00.000Z"
 *                     totalOutstanding:
 *                       type: string
 *                       example: "21000"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T08:49:49.131Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T09:05:09.616Z"
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                 message:
 *                   type: string
 *                   example: "Successfully Updated!"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       403:
 *         description: Invalid Inputs or Invoice Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Failed To Update!"
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.put("/update-invoice/:id", authMiddleware, clientController.updateInvoice);

/**
 * @swagger
 * /api/client/delete-invoice/{id}:
 *   delete:
 *     summary: Delete An Invoice By Invoice ID
 *     tags: [Client and Invoice Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the invoice to delete
 *         schema:
 *           type: integer
 *           example: 37
 *     responses:
 *       200:
 *         description: Successfully deleted the invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Successfully Deleted!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       403:
 *         description: Failed to delete the invoice (e.g., invoice not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Failed To Delete!"
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.delete("/delete-invoice/:id", authMiddleware, clientController.deleteInvoice);


/**
 * @swagger
 * /api/client/retrieve/invoice-list/:
 *   get:
 *     summary: Retrieve a List of Invoices w/Search and Pagination
 *     tags: [Client and Invoice Management]
 *     parameters:
 *       - in: query
 *         name: query
 *         description: Search query for filtering invoices or clients by company name, invoice number, or description
 *         required: false
 *         schema:
 *           type: string
 *           example: "LWS-24-0004"
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: The number of records per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully Retrieved the List of Invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     clients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 8
 *                           firstname:
 *                             type: string
 *                             example: "Juan"
 *                           lastname:
 *                             type: string
 *                             example: "Dela Cruz"
 *                           email:
 *                             type: string
 *                             example: "juandelacruz@example.com"
 *                           companyName:
 *                             type: string
 *                             example: "Lightweight Solutions"
 *                           invoices:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 invoiceNumber:
 *                                   type: string
 *                                   example: "LWS-24-0004"
 *                                 description:
 *                                   type: string
 *                                   example: "Website Development"
 *                                 issuedDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2024-11-25T08:49:49.131Z"
 *                                 dueDate:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2024-12-31T00:00:00.000Z"
 *                                 totalOutstanding:
 *                                   type: string
 *                                   example: "6021000"
 *                     totalClients:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Result!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.get("/retrieve/invoice-list", authMiddleware, clientController.invoiceList);


/**
 * @swagger
 * /api/client/retrieve/{id}:
 *   get:
 *     summary: Retrieve a Specific Invoice Based on Invoice ID
 *     tags: [Client and Invoice Management]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the invoice to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *           example: 36
 *     responses:
 *       200:
 *         description: Successfully Retrieved the Invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 36
 *                     invoiceNumber:
 *                       type: string
 *                       example: "LWS-24-0004"
 *                     clientId:
 *                       type: integer
 *                       example: 8
 *                     description:
 *                       type: string
 *                       example: "Application Development"
 *                     rate:
 *                       type: string
 *                       example: "5000000"
 *                     quantity:
 *                       type: string
 *                       example: "1"
 *                     lineTotal:
 *                       type: string
 *                       example: "5000000"
 *                     issuedDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T08:49:49.131Z"
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T00:00:00.000Z"
 *                     totalOutstanding:
 *                       type: string
 *                       example: "6021000"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T08:49:49.131Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-25T08:49:49.131Z"
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                 message:
 *                   type: string
 *                   example: "Successfully Retrieved!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

clientRoute.get("/retrieve/:id", authMiddleware, clientController.getInvoice);

export default clientRoute;