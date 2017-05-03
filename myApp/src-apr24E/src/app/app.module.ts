import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { secondPage} from '../pages/second/second';
import { Thirdpage } from '../pages/ThirdPage/third';
import { ScoreboardQuestionmodalPage } from '../pages/Scoreboard-questionmodal/Scoreboard-questionmodal';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    secondPage,
    Thirdpage,
    ScoreboardQuestionmodalPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    secondPage,
    Thirdpage,
    ScoreboardQuestionmodalPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
