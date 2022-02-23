import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';
import { ValueSharedService } from '../value-shared.service';

import * as constant from '../constant';

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.css']
})
export class ContactSearchComponent implements OnInit {
  contacts: Contact[];
  keyword: string;

/*
  selectedContact: Contact
*/  
page = constant.PAGE;
pageSize = constant.PAGESIZE;
maxSize = constant.MAXSIZE;

  constructor (
    private contactService: ContactService,
    private route: ActivatedRoute,
    private location: Location,
    private valueSharedService: ValueSharedService
    ) {
      this.route.queryParams.subscribe(params =>{
        this.keyword = params[ 'keyword' ];
      });
    }

  ngOnInit() {
//    this.contactService
//      .getContacts_search(this.keyword)
//      .then((contacts: Contact[]) => {
//        this.contacts = contacts.map((contact) => {
//          return contact;});
//        this.valueSharedService.contacts = this.contacts;
//        this.valueSharedService.pageSize = this.pageSize;
//      });
    this.new_search();
  }

  new_search(){
    this.contactService
      .getContacts_search(this.keyword)
      .then((contacts: Contact[]) => {
        this.contacts = contacts.map((contact) => {
          return contact;});
        this.valueSharedService.contacts = this.contacts;
//      this.valueSharedService.pageSize = this.pageSize;
        this.valueSharedService.pageSize = this.contacts.length;
      });
  }

  goBack(): void{
    this.location.back();
  }

}
