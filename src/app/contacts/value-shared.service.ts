import { Injectable } from '@angular/core';
import { Contact } from './contact'; 

@Injectable({
  providedIn: 'root'
})
export class ValueSharedService {

  constructor() { }
  contacts: Contact[];
  pageSize: number;
}
