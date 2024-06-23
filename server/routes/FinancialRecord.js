const express = require('express');
const FinancialRecord = require("../models/FinancialRecord")

const router = express.Router();

router.get("/getAllByUserID/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecord.find({ userId: userId });
    if (records.length === 0) {
      return res.status(404).send("No records found for the user.");
    }
    res.status(200).json({
        message:"records created successfully",
        data:records,
    })
  } catch (err) {
    res.status(500).json({
        message:"Error while creating records"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {userId,  description, amount, category, paymentMethod} = req.body;
    if(!userId || !description || !amount || !category || !paymentMethod){
        res.status(404).json({
            message:"All fields required",
        })
    }
    const newRecord = await FinancialRecord.create({
                                            userId,
                                            description,
                                            amount,
                                            category,
                                            paymentMethod,
                                            });
   // const savedRecord = await newRecord.save();
    res.status(200).json({
        message:"records created successfully",
        data:newRecord,
    });
  } catch (err) {
    res.status(500).json({
        message:"Record can not be created",
    })
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecord.findByIdAndUpdate(
      {
        _id:id,
      },
      newRecordBody,
      { new: true }
    );

    if (!record) return res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecord.findByIdAndDelete(id);
    if (!record) return res.status(404).send();
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router