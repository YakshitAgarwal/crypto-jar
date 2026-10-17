const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { startTransactionMonitor } = require("./services/transactionMonitor");

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.use("/api", require("./routes/route"));

async function startServer() {
  try {
    await connectDB();

    startTransactionMonitor();

    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
