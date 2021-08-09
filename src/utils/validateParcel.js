import Joi from "joi";

function validateParcelInfo(parcelInfo) {
  const schema = Joi.object({
    receiverName: Joi.string().min(2).max(100).required(),
    receiverPhone: Joi.string().min(2).max(50).required(),
    parcelOrigin: Joi.string().min(2).max(255).required(),
    parcelDestination: Joi.string().min(2).max(255).required(),
    parcelNote: Joi.string().min(2).max(255),
  });
  return schema.validate(parcelInfo);
}

function validateParcelDestination(parcelInfo) {
  const schema = Joi.object({
    parcelDestination: Joi.string().min(2).max(255).required()
  })
  return schema.validate(parcelInfo);
}

function validatePresentLocation(parcelInfo) {
  const schema = Joi.object({
    presentLocation: Joi.string().min(2).max(255).required()
  })
  return schema.validate(parcelInfo);
}

export { validateParcelInfo, validateParcelDestination, validatePresentLocation };
