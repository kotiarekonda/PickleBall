import { Component } from '@angular/core';
import { NavController, NavParams,AlertController} from 'ionic-angular';
import{TournamentsdirectorhomePage} from '../tournamentsdirectorhome/tournamentsdirectorhome';
import {RecmodalhomepagePage} from '../recmodalhomepage/recmodalhomepage';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  SignInShow=false;
  createtournmentshow=false;
  Homepageobj:any={};
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams) {}

  //function for TournmentDirector opstion click.
  TournmentDirectors(){
    this.navCtrl.push(TournamentsdirectorhomePage);
    // this.Homepageobj.LoginUserName=null;
    // this.Homepageobj.LoginPassword=null;
    // this.SignInShow=!this.SignInShow;
    
  }

  //function for login form validastionse card.
  // Login(){
  //     if(this.Homepageobj.UserId ===null || this.Homepageobj.LoginUserName===null){
  //           this.AlertMethode("Enter coruct UserName");
  //     }else if(this.Homepageobj.Password === null || this.Homepageobj.LoginPassword ===null){
  //           this.AlertMethode("Enter coruct password");
  //     }else if(this.Homepageobj.UserId !=null && this.Homepageobj.LoginUserName!=null && this.Homepageobj.Password !=null && this.Homepageobj.LoginPassword !=null ){
  //        if(this.Homepageobj.UserId===this.Homepageobj.LoginUserName && this.Homepageobj.Password=== this.Homepageobj.LoginPassword){
  //          this.navCtrl.push(TournamentsPage,this.Homepageobj);
  //           this.SignInShow=false;
  //        }else{
  //          this.SignInShow=false;
  //          this.AlertMethode("Enter Valid UserId And password");
  //        }      
  //     }else{
  //       this.AlertMethode("Please create New Tournament");
  //     }
  // }

  //function for close login card.
  closeLogin(){
    this.SignInShow=false;
  } 

  // function for Show create tournment card.
  Showcreatetournmentcard(){
    this.SignInShow=false;
    this.createtournmentshow=!this.createtournmentshow;

  }
  // function for Show creae tournment.
  createtournment(){
   
    if(this.Homepageobj.TournamentTitle===null){
          this.AlertMethode("Fill TournamentTitle Details");
      }else if(this.Homepageobj.UserId===null){
          this.AlertMethode("Fill Tournament User Details");
      }else if(this.Homepageobj.Password===null){
          this.AlertMethode("Fill Password");
      }else if(this.Homepageobj.TournamentLogo===null){
          this.AlertMethode("Fill TournamentLogo Details");
      }else if(this.Homepageobj.TournamentStartDate===null){
          this.AlertMethode("Fill TournamentStartDate Details");
      }else if(this.Homepageobj.TournamentEndDate===null){
          this.AlertMethode("Fill TournamentEndDate Details");
      }else if(this.Homepageobj.TournamentAddress===null){
          this.AlertMethode("Fill TournamentAddress Details");
      }else if(this.Homepageobj.TournamentZipcode===null){
          this.AlertMethode("Fill TournamentZipcode Details");
      }else if(this.Homepageobj.TournamentCity===null){
          this.AlertMethode("Fill TournamentCity Details");
      }else{
          this.createtournmentshow=false;
          this.Homepageobj.TournamentLogo="assets/icon/newicon.png";
      }

  }

  //function for RecMode methode.
  RecMode(){
      this.navCtrl.push(RecmodalhomepagePage);
  }

  //function for alert messages
    AlertMethode(str){
          let prompt = this.alertCtrl.create({
          message: str,
          buttons: [
            {
            text: 'ok',
            handler: data => {
            }
          }
        ]
      });
      prompt.present();
    }

  
  

}
