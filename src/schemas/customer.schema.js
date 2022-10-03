import joi from "joi";

const customerSchema = joi.object({
  name: joi.string().empty().trim().required(),
  phone: joi
    .string()
    .pattern(/^[0-9]?[0-9]{10}$/)
    .required(),
  cpf: joi
    .string()
    .pattern(/^[0-9]{11}$/)
    .required(),
  birthday: joi.date().required(),
});

export { customerSchema };
