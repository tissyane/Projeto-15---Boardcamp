import joi from "joi";

const categorySchema = joi.object({
  name: joi.string().empty().trim().required(),
});
export { categorySchema };
