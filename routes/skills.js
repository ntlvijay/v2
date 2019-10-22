const express = require("express");
const Skill = require("../models/skill.js");
const router = express.Router();

router.post("", (req, res, next) => {
    const skill = new Skill({
      Oppurtunity: req.body.skill_name  ,
      ClientName:  req.body.sub_skills});
      skill.save();
    res.status(201).json({
    message: "Skill added successfully"
  });
});

router.get("", (req, res, next) => {
    Skill.find().then(documents => {
      res.status(200).json({
        message: "Skills fetched successfully!",
        skills: documents
      });
    });
  });

  module.exports = router;