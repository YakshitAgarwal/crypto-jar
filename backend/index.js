const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();

const PORT = 8000;

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.use("/api", require("./routes/route"));

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
