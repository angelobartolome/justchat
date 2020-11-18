import { ReturnModelType } from '@typegoose/typegoose/lib/types';
export abstract class ServiceBase<TModel> {
  constructor(protected readonly model: ReturnModelType<new () => TModel>) {}
}
