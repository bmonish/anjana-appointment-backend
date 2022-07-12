const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Appointment API running"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/appointment", require("./routes/api/appointment"));

const PORT = 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
