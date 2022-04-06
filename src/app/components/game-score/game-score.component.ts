import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Game, Frame } from '../../classes/game.classes';

@Component({
  selector: 'app-game-score',
  templateUrl: './game-score.component.html',
  styleUrls: ['./game-score.component.scss'],
})
export class GameScoreComponent implements OnInit {
  public game: Game = new Game(['Test']);

  public headerNumbers: number[] = [...Array(10).keys()].map((n) => n + 1);

  public lastTrowRest: number = 10;

  constructor(private gameService: GameService) {
    gameService.players$.subscribe((names: string[]) => {
      this.game = new Game(names);
    });
  }

  ngOnInit(): void {}

  public trow(pins: number): void {
    this.lastTrowRest = this.game.frameStage
      ? 10
      : pins === 10
      ? 10
      : 10 - pins;
    this.game.trow(pins);
  }

  public previousPoints(frames: Frame[], position: number): number {
    return frames
      .map((frame: Frame) => frame.framePoints)
      .filter((num: number, index: number) => index < position)
      .reduce((a, b) => a + b, 0);
  }

  public gameEnd(): void {
    this.gameService.statusGame$.next(false);
  }
}
