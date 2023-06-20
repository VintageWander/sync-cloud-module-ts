import * as Joi from 'joi';

export class SetDataRequest {
  [key: string]: string | object;
}

export const SetDataRequestSchema = Joi.object()
  .pattern(
    Joi.string().required(),
    Joi.alternatives(Joi.string().required(), Joi.object().required()),
  )
  .required();
