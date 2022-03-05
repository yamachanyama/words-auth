import { Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ActivatedRoute,Router, NavigationEnd } from '@angular/router';
import { Observable,Observer,fromEvent,from } from 'rxjs';

import { Location } from '@angular/common';
import { ValueSharedService } from '../value-shared.service';

import * as constant from '../constant';

@Component({
  selector: 'contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})

export class ContactListComponent implements OnInit {
  contacts: Contact[];
//  contacts1: Contact1[];
  keyword: string;
  count: number; //collectionsize
  ok_ng="NG";

  page = constant.PAGE;
  pageSize = constant.PAGESIZE;
  maxSize = constant.MAXSIZE;

  /* selectedContact: Contact */  
  check: boolean | any[] =[this.pageSize];

   //追加
  navigationSubscription;

  constructor (
    private contactService: ContactService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private valueSharedService: ValueSharedService)
    {
    //https://qiita.com/ParisMichael/items/6a1bed373f0bf4ce755d
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // NavigationEnd eventが起こった時に初期化メソッドを呼んで、リロードっぽく見せる。
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    })
  }

  // 好きな初期化メソッド
  initialiseInvites() {}



  ngOnInit() {
    // URLからパラメータを取得する
    this.get_param();
    // listを読みこむ
    this.get_list();
  }

  // URLからパラメータを取得する
  get_param(){
    this.route.queryParams.subscribe(params =>{
      if (params[ 'page' ]){
        this.page = params[ 'page' ];
      }
      if (params[ 'ok_ng' ]){
        this.ok_ng = params[ 'ok_ng' ];
      }
    });
  }

  get_list(){
    this.contactService
    .getContacts$((this.page-1)*this.pageSize,this.ok_ng,this.pageSize)
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts.map((contact) => {
        return contact;
      });
      // 読み込んだリストデータを、一旦valueSharedServiceに保管し、detailボタンが押されたらこのデータを参照するようにする。
      this.valueSharedService.contacts = this.contacts;
      this.valueSharedService.pageSize = this.contacts.length;
    });

    this.contactService
    .getContacts_count(this.ok_ng)
    .then((Count: number) => this.count = Count);
    
    // checkビットをクリア＝false　にセットする
    for (let i =0; i < this.valueSharedService.pageSize; i++){
      this.check[i] = false;
    }
  }

  // OK Listのボタンが押された時に、これを実行する
  changePage() {
    // eurryParamsにてURLをセットする
    if (this.ok_ng == "NG"){
      this.ok_ng = "OK";
    } else {
      this.ok_ng = "NG";
    }
    // 該当ページのリストデータを取得する
    this.get_list();
    // 再表示する
    this.router.navigate([], { queryParams: { page: 1, ok_ng: this.ok_ng } });
    // this.changeDetectorRef.detectChanges();
  }

  // Change NG to OK　を押した時に、これを実行する
  change_status(){
    // チェックが付いている場合、ステータスをOKに変更する。
    for (let i =0; i < this.valueSharedService.pageSize; i++){
      if (this.check[i]){
        this.contacts[i].NG ="OK";
        // OKNGのみデータを更新する
        this.contactService.updateContact(this.contacts[i]);
        //        .then(contact => this.contacts[i] = contact);
        //OKにした単語は表示しないようにする
        this.contacts[i].word="";
        this.contacts[i].meaning="";
        this.contacts[i].createDate="";
        this.check[i]=false;
      }
    }
  }

  // ngb-pagenationのボタンが押された時に、ページをセットしリストを表示する
  setPage(event: number) {
    // queryParamsにてURLをセットする
    this.router.navigate([], { queryParams: { page: event, ok_ng: this.ok_ng } });
    // 該当ページのリストデータを取得する
    this.get_list();
    // 再表示する
    // this.changeDetectorRef.detectChanges();
  }

