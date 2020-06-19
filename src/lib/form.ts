import { AxiosResponse, AxiosError } from 'axios';
import Validator, { IValidationRule } from './validator';

interface IFormSubmit <T> {
  (model: T, params: IFormSumbitConfig): Promise<AxiosResponse>;
}

interface IFormSumbitConfig {
  params?: {
    [key: string]: any;
  }
}

export default class Form <T> {
  public model: T;
  public statusText: string = '';
  public errorText: string = '';

  protected validator = new Validator();
  protected busy: boolean = false;
  protected submitAction: IFormSubmit<T>;

  constructor (model: T, submitAction: IFormSubmit<T>) {
    this.model = model;
    this.submitAction = submitAction;
    this.validator.setBody(this.model);
  }

  public hasErrorField (field: string): boolean {
    if (
      this.validator.validationResult &&
      this.validator.validationResult.fields[field] &&
      this.validator.validationResult.fields[field].errors.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  public getFieldErrors (field: string, onePerField?: boolean): Array<string> {
    if (
      this.validator.validationResult &&
      this.validator.validationResult.fields[field] &&
      this.validator.validationResult.fields[field].errors.length > 0
    ) {
      if (onePerField) {
        return [this.validator.validationResult.fields[field].errors[0]];
      } else {
        return this.validator.validationResult.fields[field].errors;
      }
    } else {
      return [];
    }
  }

  public parseResponseError (errorsResponse: any) {
    if (!errorsResponse) {
      this.validator.clearValidationResult();
    } else {
      this.validator.setValidationResult(errorsResponse.data);
    }
  }

  public async submit (config?: IFormSumbitConfig) {
    if (!config) {
      config = <IFormSumbitConfig>{};
    }

    try {
      this.statusText = '';
      this.errorText = '';
      this.busy = true;
      const response = await this.submitAction(this.model, config);
      this.busy = false;
      return response;
    } catch (error) {
      this.busy = false;
      this.parseResponseError(error.response);
      throw error;
    }
  }

  public clearErrors () {
    this.errorText = '';
    this.validator.clearValidationResult();
  }

  public async checkField (field: string) {
    await this.validator.checkField(field);
  }

  public setValidatorRules (rules: IValidationRule[]) {
    this.validator.setRules(rules);
    return this;
  }

  public setModel (model: any) {
    this.model = model;
    this.validator.setBody(this.model);
  }

  public formDataStructureChanget () {
    this.validator.clearFullRulesList();
  }

  public getValidator () {
    return this.validator;
  }

  public getValidationResult () {
    return this.validator.validationResult;
  }
};
