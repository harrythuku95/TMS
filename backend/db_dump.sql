--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.enum_users_role AS ENUM (
    'Admin',
    'Agent',
    'User'
);


ALTER TYPE public.enum_users_role OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CloseRequestApprovers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."CloseRequestApprovers" (
    id uuid NOT NULL,
    "closeRequestId" uuid,
    "userId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."CloseRequestApprovers" OWNER TO admin;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO admin;

--
-- Name: closeRequest; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."closeRequest" (
    id uuid NOT NULL,
    approved boolean DEFAULT false,
    number_of_approval_requests integer DEFAULT 0,
    "ticketId" uuid,
    "createdById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."closeRequest" OWNER TO admin;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.customers (
    id uuid NOT NULL,
    customer_id character varying(255),
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    address text,
    "importHash" character varying(255),
    "createdById" uuid,
    "updatedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.customers OWNER TO admin;

--
-- Name: file; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.file (
    id uuid NOT NULL,
    "belongsTo" character varying(255),
    "belongsToId" uuid,
    "belongsToColumn" character varying(255),
    name character varying(2083) NOT NULL,
    "sizeInBytes" integer,
    "privateUrl" character varying(2083),
    "publicUrl" character varying(2083) NOT NULL,
    "createdById" uuid,
    "updatedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.file OWNER TO admin;

--
-- Name: files; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    "belongsTo" character varying(255),
    "belongsToId" uuid,
    "belongsToColumn" character varying(255),
    name character varying(2083) NOT NULL,
    "sizeInBytes" integer,
    "privateUrl" character varying(2083),
    "publicUrl" character varying(2083) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdById" uuid,
    "updatedById" uuid
);


ALTER TABLE public.files OWNER TO admin;

--
-- Name: ticket_counts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ticket_counts (
    id uuid NOT NULL,
    count_id text,
    count_type character varying(255),
    count_value integer DEFAULT 0,
    "ticketId" uuid,
    "importHash" character varying(255),
    "createdById" uuid,
    "updatedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.ticket_counts OWNER TO admin;

--
-- Name: ticket_labels; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ticket_labels (
    id uuid NOT NULL,
    label_id text,
    "ticketId" uuid,
    "importHash" character varying(255),
    "createdById" uuid,
    "updatedById" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.ticket_labels OWNER TO admin;

--
-- Name: tickets; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tickets (
    id uuid NOT NULL,
    subject character varying(255) NOT NULL,
    priority character varying(255) NOT NULL,
    description text NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    "assigneeId" uuid,
    "customerId" uuid,
    "createdById" uuid,
    "updatedById" uuid,
    "importHash" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public.tickets OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    "firstName" text,
    "lastName" text,
    "phoneNumber" text,
    disabled boolean DEFAULT false NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'User'::public.enum_users_role NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "emailVerificationToken" text,
    "emailVerificationTokenExpiresAt" timestamp with time zone,
    "passwordResetToken" text,
    "passwordResetTokenExpiresAt" timestamp with time zone,
    provider text,
    "importHash" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "createdById" uuid,
    "updatedById" uuid
);


ALTER TABLE public.users OWNER TO admin;

--
-- Data for Name: CloseRequestApprovers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."CloseRequestApprovers" (id, "closeRequestId", "userId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240903080419-create-users.js
20240903080548-create-customers.js
20240903080650-create-tickets.js
20240903081335-create-ticket-counts.js
20240903081429-create-ticket-labels.js
20240903081601-create-files.js
20240903081640-create-close-requests.js
20240903081815-create-close-request-approvers.js
20240903085021-add-created-by-and-updated-by-to-users.js
\.


--
-- Data for Name: closeRequest; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."closeRequest" (id, approved, number_of_approval_requests, "ticketId", "createdById", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.customers (id, customer_id, name, email, phone, address, "importHash", "createdById", "updatedById", "createdAt", "updatedAt", "deletedAt") FROM stdin;
b6918c7b-162a-40a2-a9f4-8bc1c6d3d902	\N	Obiex	obiex@gmail.com	\N	300718	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-10 15:11:53.826+03	2024-09-10 16:04:51.211+03	2024-09-10 16:04:51.206+03
55f8d669-fc5b-4c4f-9573-4e874113363b	\N	Coast	coast@gmail.com	\N	200718	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-10 15:11:22.359+03	2024-09-10 16:04:57.613+03	2024-09-10 16:04:57.613+03
10e3e4e1-945b-486a-82e9-9c201b3b4c19	\N	Tradefada	tradefada@gmail.com	\N	12345678	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-16 13:41:18.291+03	2024-09-16 14:00:19.619+03	2024-09-16 14:00:19.619+03
79f11c3d-0cee-4e72-87b2-2fc8fc84a72d	\N	Busha	busha@gmail.com	0123445566	20008786	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-10 15:10:54.51+03	2024-09-16 14:00:22.881+03	2024-09-16 14:00:22.881+03
e3a8f25f-6646-4f12-a80c-107d5c798ee6	\N	Obiex	harryomollo95@gmail.com	0797751299	100718	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-10 16:12:46.07+03	2024-09-16 14:00:26.134+03	2024-09-16 14:00:26.134+03
4ac3125a-25e0-4328-b4bd-c3e05892797e	CUST1726485528039Obiex	Coast	info@obiex.com	0797758299	10718	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-16 14:18:48.041+03	2024-09-16 14:32:22.42+03	\N
60dc3419-e4d8-48cf-b0bc-8611e583715a	CUST1726565570892SparlingFinance	Sparling Finance	sparling@gmail.com	11122233445	050504034444	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-17 12:32:50.893+03	2024-09-17 12:33:04.967+03	\N
110742fb-5b21-46d6-bf4b-2cc1b8c6aa26	CUST1726565778834Bitfinex	Bitfinex	bitfinex@gmail.com	099994567	456978444	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-17 12:36:18.838+03	2024-09-17 12:36:51.272+03	2024-09-17 12:36:51.271+03
7ca2c6bf-cfe7-4e25-9df5-55d42d06b74e	CUST1726485595500Busha	Busha	bush@busha.com	07005667890	00611	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	2024-09-16 14:19:55.501+03	2024-09-17 12:38:54.289+03	\N
\.


--
-- Data for Name: file; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.file (id, "belongsTo", "belongsToId", "belongsToColumn", name, "sizeInBytes", "privateUrl", "publicUrl", "createdById", "updatedById", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.files (id, "belongsTo", "belongsToId", "belongsToColumn", name, "sizeInBytes", "privateUrl", "publicUrl", "createdAt", "updatedAt", "deletedAt", "createdById", "updatedById") FROM stdin;
f64838ce-fd7c-45be-823a-9ab4dcc7c603	tickets	0c0f0d73-0098-4978-b2e1-bb9f80344e87	files	1725970374713.PNG	132655	uploads\\1725970374713.PNG	/uploads/1725970374713.PNG	2024-09-10 15:12:54.753+03	2024-09-10 15:12:54.753+03	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c
5a42cef8-2e3d-4942-a51e-ead54ed38f24	tickets	d41438a1-0ef1-4fc8-9493-4245715709af	files	1725973435033.PNG	144465	uploads\\1725973435033.PNG	/uploads/1725973435033.PNG	2024-09-10 16:03:55.248+03	2024-09-10 16:03:55.248+03	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c
0b53599f-b86a-45d3-ae11-6cb0730deb4c	tickets	778794e0-523f-46fc-b001-57b2a11663da	files	1726561077465.jpeg	159160	uploads\\1726561077465.jpeg	/uploads/1726561077465.jpeg	2024-09-17 11:17:57.556+03	2024-09-17 11:17:57.556+03	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c
50188dc4-aeb4-4116-a7fb-402429fdc0bc	tickets	43dd6594-4c45-4bd8-8a86-26d7e4d8d604	files	1726563434017.jpeg	159160	uploads\\1726563434017.jpeg	/uploads/1726563434017.jpeg	2024-09-17 11:57:14.118+03	2024-09-17 11:57:14.118+03	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c
3fed656f-9ecc-4a24-ab12-62618c1fca22	tickets	e937e315-dac4-41dc-a502-3a0ee6f259b6	files	1726565509002.jpg	4069920	uploads\\1726565509002.jpg	/uploads/1726565509002.jpg	2024-09-17 12:31:49.174+03	2024-09-17 12:31:49.174+03	\N	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c
\.


--
-- Data for Name: ticket_counts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ticket_counts (id, count_id, count_type, count_value, "ticketId", "importHash", "createdById", "updatedById", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ticket_labels; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ticket_labels (id, label_id, "ticketId", "importHash", "createdById", "updatedById", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tickets (id, subject, priority, description, status, "assigneeId", "customerId", "createdById", "updatedById", "importHash", "createdAt", "updatedAt", "deletedAt") FROM stdin;
0c0f0d73-0098-4978-b2e1-bb9f80344e87	Failing Withdrawals	High	Pasted description from customers goes here	Pending	\N	79f11c3d-0cee-4e72-87b2-2fc8fc84a72d	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-10 15:12:54.725+03	2024-09-10 15:12:54.725+03	\N
d41438a1-0ef1-4fc8-9493-4245715709af	Failing Withdrawals	Medium	Pasted description content from customer goes here	closed	\N	b6918c7b-162a-40a2-a9f4-8bc1c6d3d902	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-10 16:03:55.11+03	2024-09-13 16:05:57.05+03	\N
7d715908-d3f4-46a2-a300-a63841dcdfc6	Failing Login System	Medium	Experiencing Failing Login	open	482ff0c2-2b7a-4296-b989-ffc02548c227	79f11c3d-0cee-4e72-87b2-2fc8fc84a72d	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-13 16:14:29.863+03	2024-09-17 10:48:51.795+03	\N
778794e0-523f-46fc-b001-57b2a11663da	Disruptive Login System	High	The login System is disruptive	Pending	482ff0c2-2b7a-4296-b989-ffc02548c227	7ca2c6bf-cfe7-4e25-9df5-55d42d06b74e	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-17 11:17:57.488+03	2024-09-17 11:18:28.67+03	\N
43dd6594-4c45-4bd8-8a86-26d7e4d8d604	Failing Withdrawals	Medium	Pasted description from customer goes here	in_progress	482ff0c2-2b7a-4296-b989-ffc02548c227	7ca2c6bf-cfe7-4e25-9df5-55d42d06b74e	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-17 11:57:14.054+03	2024-09-17 12:29:46.643+03	\N
e937e315-dac4-41dc-a502-3a0ee6f259b6	Failing Deposit Transactions	High	Description goes here	closed	482ff0c2-2b7a-4296-b989-ffc02548c227	7ca2c6bf-cfe7-4e25-9df5-55d42d06b74e	701f9512-5f3f-4348-b6a4-66644674460c	701f9512-5f3f-4348-b6a4-66644674460c	\N	2024-09-17 12:31:49.116+03	2024-09-17 12:39:47.226+03	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, "firstName", "lastName", "phoneNumber", disabled, email, password, role, "emailVerified", "emailVerificationToken", "emailVerificationTokenExpiresAt", "passwordResetToken", "passwordResetTokenExpiresAt", provider, "importHash", "createdAt", "updatedAt", "deletedAt", "createdById", "updatedById") FROM stdin;
701f9512-5f3f-4348-b6a4-66644674460c	Harry	Thuku	\N	f	harrythukuomolloh@gmail.com	$2b$10$o0.44wF82RSFCWAyrdic.uyj3BS.4ErNM0g8p3fMwApY6zQ5VHNIq	Admin	t	\N	\N	\N	\N	\N	\N	2024-09-10 15:10:09.174+03	2024-09-10 15:10:09.174+03	\N	\N	\N
482ff0c2-2b7a-4296-b989-ffc02548c227	Brian	Thuku	\N	f	brian@devthuku.io	$2b$10$aoPC/Iwp7RgpBnqgk59K6OJWICgJF0hs7xA/.rvqdDwhaGHW5UejW	Agent	t	\N	\N	\N	\N	\N	\N	2024-09-16 14:34:34.076+03	2024-09-16 22:18:04.783+03	\N	\N	\N
\.


--
-- Name: CloseRequestApprovers CloseRequestApprovers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."CloseRequestApprovers"
    ADD CONSTRAINT "CloseRequestApprovers_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: closeRequest closeRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."closeRequest"
    ADD CONSTRAINT "closeRequest_pkey" PRIMARY KEY (id);


--
-- Name: customers customers_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_id_key UNIQUE (customer_id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_importHash_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "customers_importHash_key" UNIQUE ("importHash");


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: file file_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: ticket_counts ticket_counts_importHash_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_counts
    ADD CONSTRAINT "ticket_counts_importHash_key" UNIQUE ("importHash");


--
-- Name: ticket_counts ticket_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_counts
    ADD CONSTRAINT ticket_counts_pkey PRIMARY KEY (id);


--
-- Name: ticket_labels ticket_labels_importHash_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_labels
    ADD CONSTRAINT "ticket_labels_importHash_key" UNIQUE ("importHash");


--
-- Name: ticket_labels ticket_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_labels
    ADD CONSTRAINT ticket_labels_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_importHash_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_importHash_key" UNIQUE ("importHash");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: CloseRequestApprovers CloseRequestApprovers_closeRequestId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."CloseRequestApprovers"
    ADD CONSTRAINT "CloseRequestApprovers_closeRequestId_fkey" FOREIGN KEY ("closeRequestId") REFERENCES public."closeRequest"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CloseRequestApprovers CloseRequestApprovers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."CloseRequestApprovers"
    ADD CONSTRAINT "CloseRequestApprovers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: closeRequest closeRequest_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."closeRequest"
    ADD CONSTRAINT "closeRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: closeRequest closeRequest_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."closeRequest"
    ADD CONSTRAINT "closeRequest_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customers customers_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "customers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customers customers_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "customers_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: file file_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT "file_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: file file_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT "file_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id);


--
-- Name: files files_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "files_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: files files_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT "files_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ticket_counts ticket_counts_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_counts
    ADD CONSTRAINT "ticket_counts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: ticket_counts ticket_counts_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_counts
    ADD CONSTRAINT "ticket_counts_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ticket_counts ticket_counts_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_counts
    ADD CONSTRAINT "ticket_counts_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id);


--
-- Name: ticket_labels ticket_labels_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_labels
    ADD CONSTRAINT "ticket_labels_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: ticket_labels ticket_labels_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_labels
    ADD CONSTRAINT "ticket_labels_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.tickets(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ticket_labels ticket_labels_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ticket_labels
    ADD CONSTRAINT "ticket_labels_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id);


--
-- Name: tickets tickets_assigneeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tickets tickets_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "tickets_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id);


--
-- Name: users users_updatedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

