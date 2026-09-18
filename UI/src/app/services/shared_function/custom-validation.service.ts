import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {


static validate(control: AbstractControl): { whitespace: boolean } {
  const valueNoWhiteSpace = control.value.trim();
  const isValid = valueNoWhiteSpace === control.value;
  return isValid ? { whitespace: false } : { whitespace: true };
}
   

 
}