// REQUIRE
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes/indexRouter.js");


// EXPRESS()
const app = express();

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
// MIDDLEWARE: CORS CONFIGURATION
const allowedOrigins = [
  process.env.ALLOWED_ORIGINS, // Tu frontend en producción
  'http://localhost:5173'             // Desarrollo local
].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origen (ej. curl, postman) o si el origen está en la lista blanca
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// MIDDLEWARE TO THE ROUTER
app.use("/", router);

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  /* ?? */
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

// EXPORTS
module.exports = app;
