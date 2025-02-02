import { Component } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  template: ''
})
export abstract class BaseFormComponent {
  form!: FormGroup;

  constructor() { }

  public getErrors(
    control: AbstractControl,
    displayName: string,
    customMessages: { [key: string]: string } = {}
  ): string[] {
    let errors: string[] = [];

    Object.keys(control.errors || {}).forEach((key) => {
      switch (key) {
        case 'required':
          errors.push(`${displayName} is required.`);
          break;
        case 'pattern':
          errors.push(customMessages[key] ?? `${displayName} doesn't match the required pattern.`);
          break;
        case 'isFieldDuplicate':
          errors.push(`${displayName} already exists. Please choose another.`);
          break;
        default:
          errors.push(`${displayName} is invalid.`);
          break;
      }
    });

    return errors;
  }
}
