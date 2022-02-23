import { Component, Input, ElementRef, ViewEncapsulation, ViewChild} from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ValueSharedService } from '../value-shared.service';

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";
import { SwiperComponent } from "swiper/angular";


// install Swiper modules
SwiperCore.use([Pagination, Navigation]);


@Component({
  selector: 'contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: [
    './contact-details.component.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ContactDetailsComponent {
  constructor (
    private contactService: ContactService,
    private route: ActivatedRoute,
    private location: Location,
    private valueSharedService: ValueSharedService
    ) {}

  contacts: Contact[];
  contact: Contact;
  deletedID: String;
  NgSel = ['OK','NG'];
  pageSize: number;
  startpage: number;

  ngOnInit(): void {
    this.getContact();
  }

  getContact(): void {
    this.contacts = this.valueSharedService.contacts;
    this.pageSize = this.valueSharedService.pageSize;
    const _id = this.route.snapshot.paramMap.get('id');
    if (_id == '0') {
      this.createNewContact();
    }else{
      for (let i =0; i < this.pageSize; i++){
        if (this.contacts[i]._id == _id){
          this.contact = this.contacts[i];
          this.startpage = i;
        }
      }
    }
  }

//getContact(): void {
//  const _id = this.route.snapshot.paramMap.get('id');
//  if (_id == '0') {
//    this.createNewContact();
//  }
//  else{
//  this.contactService.getContact(_id)
//    .then(contact => this.contact = contact);
//  }
//}

  goBack(): void{
    this.location.back();
  }

  createNewContact() {
    this.contact = {
      word: '',
      meaning: '',
      NG: 'NG',
      createDate: ''
    };
  }

  createContact(): void {
    this.contactService.createContact(this.contact)
    .then(contact => this.contact = contact);
    this.goBack();
  }

  updateContact(): void {
    this.contactService.updateContact(this.contact)
    .then(contact => this.contact = contact);
    this.goBack();
  }

  deleteContact(): void {
    this.contactService.deleteContact(this.contact._id.toString())
    .then((deletedContactID: String) => this.deletedID = deletedContactID);
    this.goBack();
  }

/*
  @Input()
  contact: Contact;
  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;

  createContact(contact: Contact) {
    this.contactService.createContact(contact).then((newContact: Contact) => {
      this.createHandler(newContact);
    });
  }
  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact).then((updatedContact: Contact) => {
      this.updateHandler(updatedContact);
    });
  }
  deleteContact(contactId: String): void {
    this.contactService.deleteContact(contactId).then((deletedContactId: String) => {
      this.deleteHandler(deletedContactId);
    });
  }
*/

}