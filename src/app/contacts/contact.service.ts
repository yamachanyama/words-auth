import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, fromEvent, lastValueFrom, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ContactService {
  private contactsUrl1 = '/api/contacts';
  private contactsUrl2 = '/api/contact';
  private searchUrl = '/api/search';
  private countUrl = '/api/count';

  currentValue:string = "";

  /*  private contactsUrl = '/assets/contactdata.json'; */

  constructor (private http: HttpClient) {}
  /* get("/api/contacts/:skip")
    getContacts(skip): Promise<Contact[]> {
      return this.http.get(this.contactsUrl1 +'/' + skip.toString())
                 .toPromise()
                 .then(response => response.json() as Contact[])
                 .catch(this.handleError);
    }
  */
  // get("/api/contacts/:skip")
  getContacts$(skip,ok_ng,pageSize): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactsUrl1 + '/' + skip.toString() + '/' + ok_ng.toString() + '/' + pageSize.toString());
  //                  .pipe(map(
  //                    response => {return response as Contact[]}
  //                  ));
  }

  // get("/api/contacts/:keyword")
  public async getContacts_search(keyword: String) {
    const result$ = this.http.get<Contact[]>(this.searchUrl + '/' + keyword);
    const result = await lastValueFrom(result$);
    return result;
  }

  public async getContacts_count(ok_ng) {
    const result$ =this.http.get<number>(this.countUrl + '/' + ok_ng.toString());
    const result = await lastValueFrom(result$);
    return result;
  }

  /*
    getContacts():Promise<Contact[]> {
      return ()=>this.contactdata;
    }
  */

  // post("/api/contact")
  public async createContact(newContact: Contact) {
    const result$ = this.http.post<Contact>(this.contactsUrl2, newContact);
    const result = await lastValueFrom(result$);
    return result;
  }

  // get("/api/contact/:id") endpoint not used by Angular app
  public async getContact(getContactID: String) {
    const result$ = this.http.get<Contact>(this.contactsUrl2+ '/' + getContactID);
    const result = await lastValueFrom(result$);
    return result;
  }

  // put("/api/contact/:id")
  public async updateContact(putContact: Contact) {
    var putUrl = this.contactsUrl2 + '/' + putContact._id;
    const result$ = this.http.put<Contact>(putUrl, putContact);
    const result = await lastValueFrom(result$);
    return result;
  }
    
  // delete("/api/contact/:id")
  public async deleteContact(delContactId: String) {
    const result$ = this.http.delete<String>(this.contactsUrl2 + '/' + delContactId);
    const result = await lastValueFrom(result$);
    return result;
  }

  private handleError (error: any){
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console
    return Promise.reject(errMsg);
  }

}