import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

//(Before 8.0.0) import * as firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router:Router, 
    public afAuth: AngularFireAuth, 
    private ngZone: NgZone) {}
  
  DisplayName: string;

//async ngOnInit() {
  ngOnInit() {
    //  https://firebase.google.com/docs/reference/js/firebase.auth.Auth
    console.log("ngOnInit");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    //    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    //  onAuthStateChangedについて　⇒https://firebase.google.com/docs/auth/web/manage-users?hl=ja
    //  ログイン、ログアウトしたらonAuthStageChangedがそれを察知してrouter.navigateを実行する。これを入れないと、ログイン認証後にアプリが実行されないので注意　⇒https://books.google.co.jp/books?id=QsCmDwAAQBAJ&pg=PT416&lpg=PT416&dq=get+currentUser()%7B+return+this.afAuth+!%3D+null+?+this.afAuth.currentUser+!%3D+null?&source=bl&ots=TQpbzHN3o8&sig=ACfU3U2y3P4R73hrQAUuy0gkMHLE0Ljusg&hl=ja&sa=X&ved=2ahUKEwi9_NT1pd3wAhVBBKYKHabiCXMQ6AEwCHoECAcQAw#v=onepage&q=get%20currentUser()%7B%20return%20this.afAuth%20!%3D%20null%20%3F%20this.afAuth.currentUser%20!%3D%20null%3F&f=false
    //
    //  this.afAuth.auth.onAuthStateChanged((usr)=>{
    // this.DisplayName = (await this.afAuth.currentUser).displayName;
    
    this.afAuth.onAuthStateChanged((usr)=>{
      // Authentificationの後も継続して処理が行われるようにngZone.runを入れる　https://books.google.co.jp/books?id=QsCmDwAAQBAJ&lpg=PT465&dq=angular&hl=ja&pg=PT417#v=onepage&q=angular&f=false
      console.log("onAuthStateChanged");
      this.ngZone.run(() => {
        this.router.navigate(['']);
        this.DisplayName = usr.displayName;
        console.log("ngZone");
        console.log(this.DisplayName);
      });
    });
  }

  login(){
    let provider = new firebase.auth.GoogleAuthProvider();
    /*
    this.afAuth.auth.signInWithRedirect(provider);
    */
    this.afAuth.signInWithPopup(provider);
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

// Code here !!
// https://books.google.co.jp/books?id=QsCmDwAAQBAJ&pg=PT416&lpg=PT416&dq=get+currentUser()%7B+return+this.afAuth+!%3D+null+?+this.afAuth.currentUser+!%3D+null?&source=bl&ots=TQpbzHN3o8&sig=ACfU3U2y3P4R73hrQAUuy0gkMHLE0Ljusg&hl=ja&sa=X&ved=2ahUKEwi9_NT1pd3wAhVBBKYKHabiCXMQ6AEwCHoECAcQAw#v=onepage&q=get%20currentUser()%7B%20return%20this.afAuth%20!%3D%20null%20%3F%20this.afAuth.currentUser%20!%3D%20null%3F&f=false
//  loginCheck() {
//    if (this.currentUser == '(not logined.)') {
//      this.login();
//    } else {
//      if (confirm('Are you logout now?')) {
//        this.logout();
//      }
//    }
//  }
/* app.component.tsは、currentUser()を実行してhtml側にcurrentUserを渡すだけの処理を実装 */
/* firebaseはこのコンポーネントで完結しており、バック側（node.js）での処理は不要　*/
//
// getはゲッターの模様（※ハンズオンNode.js）
//
// get currentUser(){
//  return this.afAuth != null ?
//    this.afAuth.currentUser != null? 
//      this.afAuth.currentUser.displayName:
//        '(not logined.)' :
//      '(not logined.)';
//}

}