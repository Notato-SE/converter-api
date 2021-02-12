const express = require("express");
const app = express();

const convert = require("convert-units");
const Joi = require("joi");

app.get("/possible/:name", (req, res) => {
  const possibles = convert().possibilities(req.params.name);

  res.send({
    possibles,
    success: true,
  });
});

app.get("/convert", (req, res) => {
  const schema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    amount: Joi.number().required(),
  });

  const input = schema.validate(req.query);
  if (!!input.error) {
    res.status(400).send({
      error: input.error.details[0].message,
      success: false,
    });
    return;
  }

  const val = input.value;
  try {
    val.converted = convert(val.amount).from(val.from).to(val.to).toString();
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      error: err.message,
      success: false,
    });
  }

  res.send({
    from: val.from,
    to: val.to,
    amount: val.amount.toString(),
    converted: val.converted,
    success: true,
  });
});

app.listen(3000, () => console.log("Listening on port 3000"));
