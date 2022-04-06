import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public players: string[] = [];
  public addUserFormGroup: FormGroup = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(private gameService: GameService) {
    gameService.players$.subscribe((names: string[]) => {
      this.players = names;
    });
  }

  ngOnInit(): void {}

  public addNewPlayer(): void {
    this.gameService.players$.next([
      ...this.players,
      this.addUserFormGroup.get('userName')?.value,
    ]);
    this.addUserFormGroup.reset();
  }

  public deletePlayer(i: number): void {
    this.gameService.players$.next(
      this.players.filter((p, index) => index !== i)
    );
  }

  public startGame(): void {
    this.gameService.changeStatusGame(true);
  }
}
