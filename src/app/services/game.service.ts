import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private statusGame = new BehaviorSubject(false);
  public players$ = new BehaviorSubject([] as string[]);

  constructor() {}

  public get statusGame$(): BehaviorSubject<boolean> {
    return this.statusGame;
  }

  public changeStatusGame(status: boolean): void {
    this.statusGame.next(status);
  }
}
