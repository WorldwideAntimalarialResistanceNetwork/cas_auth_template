/**
 * Application entrypoint for the WWARN Data Manager tools.
 *
 * Responsibilities
 * - Load environment variables from .env.
 * - Create and configure an Express application.
 * - Add JSON/urlencoded body parsing and session middleware.
 * - Configure the EJS view engine and make APP_BASE_PATH available to views.
 * - Initialize infrastructure clients: MySQL connection pool and AWS S3.
 * - Set up CAS authentication (@keepsolutions/cas-authentication).
 * - Mount the feature routes, passing CAS, MySQL pool, and S3 client.
 * - Start the HTTP server on PORT.
 *
 * Important environment variables
 * - PORT: Port to listen on.
 * - APP_BASE_PATH: Base URL path the app is mounted under (e.g., "/app").
 * - SESSION_SECRET: Secret for express-session.
 * - CAS_URL: Base URL of the CAS server.
 * - SERVICE_URL: Public service URL for CAS callbacks (must match CAS config).
 * - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION: AWS credentials/region.
 * - S3_BUCKET_NAME: Name of the S3 bucket that stores rule files (used by routes).
 */
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const CASAuthentication = require('@keepsolutions/cas-authentication');
const path = require('path');
const indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));



const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// CAS setup with .env variables
const cas = new CASAuthentication({
  cas_url: process.env.CAS_URL,
  service_url: `${process.env.SERVICE_URL}`,
  cas_version: '3.0',
  renew: false,
  is_dev_mode: false,
  session_name: 'cas_user',
  session_info: 'cas_userinfo',
  destroy_session: false,
  redirect_to: `${process.env.APP_BASE_PATH || '/'}`
});

// Make basePath available in views (default to empty string)
app.use((req, res, next) => {
  res.locals.basePath = process.env.APP_BASE_PATH || '';
  next();
});




// Routes, passing CAS and S3
app.use(process.env.APP_BASE_PATH, indexRouter(cas, s3));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
