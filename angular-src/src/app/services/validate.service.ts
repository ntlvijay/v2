import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  requiredFields(user) {
    if (!user.name || !user.password || !user.confirmPassword || !user.email || !user.username) {
      return false;
    } else {
      return true;
    }
  }

  validateEmail(email) {
    const re = /([a-zA-Z0-9]+)([\.{1}])?([a-zA-Z0-9]+)\@prodapt([\.])com/;
    return re.test(email);
  }

}
