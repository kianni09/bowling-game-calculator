import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public statusGame: BehaviorSubject<boolean>;

  constructor(private gameService: GameService) {
    this.statusGame = this.gameService.statusGame$;
  }
}
