const express = require("express");
const app = express();

const database = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const financialRecordRouter = require('./routes/FinancialRecord')

dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect
database.connect();

app.use(express.json());
app.use(cors());

app.use("/financial-records", financialRecordRouter);

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})