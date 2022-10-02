import joi from "joi";

const gameSchema = joi.object({
  name: joi.string().empty().trim().required(),
  image: joi.string().uri().optional(),
  stockTotal: joi.number().empty().integer().min(1).required(),
  categoryId: joi.number().empty().integer().required(),
  pricePerDay: joi.number().empty().min(1).required(),
});

export { gameSchema };
