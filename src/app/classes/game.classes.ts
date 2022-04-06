import { BehaviorSubject } from 'rxjs';

export class Frame {
  public number: number = 0;
  public pinsKnocked: number[] = [0, 0, 0];

  private result = {
    normal: 0,
    spare: 0,
    strike: 0,
  };

  constructor(number: number, pins: BehaviorSubject<number[][]>) {
    this.number = number;
    pins.subscribe((pinsKnkd: number[][]) => {
      this.pinsKnocked = pinsKnkd[this.number];
      this.result = {
        normal:
          pinsKnkd[this.number][0] +
          pinsKnkd[this.number][1] +
          pinsKnkd[this.number][2],
        spare:
          pinsKnkd[this.number][0] +
          pinsKnkd[this.number][1] +
          pinsKnkd[this.number][2] +
          this.bonusPoints(pinsKnkd, this.number, 'spare'),
        strike:
          pinsKnkd[this.number][0] +
          pinsKnkd[this.number][1] +
          pinsKnkd[this.number][2] +
          this.bonusPoints(pinsKnkd, this.number, 'strike'),
      };
    });
  }

  private bonusPoints(
    pinsKnocked: number[][],
    currentFrame: number,
    type: string
  ): number {
    if (type === 'spare') {
      return pinsKnocked.length - 1 > currentFrame
        ? pinsKnocked[currentFrame + 1][0] +
            pinsKnocked[currentFrame + 1][1] +
            pinsKnocked[currentFrame + 1][2]
        : 0;
    } else {
      if (pinsKnocked.length - currentFrame >= 3) {
        return (
          pinsKnocked[currentFrame + 1][0] +
          pinsKnocked[currentFrame + 1][1] +
          pinsKnocked[currentFrame + 1][2] +
          pinsKnocked[currentFrame + 2][0] +
          pinsKnocked[currentFrame + 2][1] +
          pinsKnocked[currentFrame + 2][2]
        );
      } else if (pinsKnocked.length - currentFrame >= 2) {
        return (
          pinsKnocked[currentFrame + 1][0] +
          pinsKnocked[currentFrame + 1][1] +
          pinsKnocked[currentFrame + 1][2]
        );
      } else {
        return 0;
      }
    }
  }

  public get framePoints(): number {
    return this.pinsKnocked[0] === 10
      ? this.result.strike
      : this.pinsKnocked[0] + this.pinsKnocked[1] === 10
      ? this.result.spare
      : this.result.normal;
  }

  public get frameResultType(): string {
    return this.pinsKnocked[0] === 10
      ? 'strike'
      : this.pinsKnocked[0] + this.pinsKnocked[1] === 10
      ? 'spare'
      : 'normal';
  }
}

export class Player {
  public name: string = '';

  private pinsKnocked$ = new BehaviorSubject([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  private pinsKnocked: number[][] = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  private frames: Frame[] = [...Array(10).keys()].map(
    (i: number) => new Frame(i, this.pinsKnocked$)
  );

  constructor(name: string) {
    this.name = name;
  }

  public get totalScore(): number {
    return this.frames
      .map((frame: Frame) => frame.framePoints)
      .reduce((a, b) => a + b, 0);
  }

  public getFrames(): Frame[] {
    return this.frames;
  }

  public knockingPins(currentFrame: number, frameStage: number, pins: number) {
    this.pinsKnocked[currentFrame][frameStage] = pins;
    this.pinsKnocked$.next(this.pinsKnocked);
  }
}

export class Game {
  public isGameEnded: boolean = false;
  public currentFrame: number = 0;
  public frameStage: number = 0;
  public currentPlayerIndex: number = 0;
  private players: Player[] = [];
  constructor(names: string[]) {
    this.players = names.map((name: string) => new Player(name));
  }

  public get currentPlayerName(): string {
    return this.players[this.currentPlayerIndex].name;
  }

  public get getPlayers(): Player[] {
    return this.players;
  }

  public trow(pins: number): void {
    this.players[this.currentPlayerIndex].knockingPins(
      this.currentFrame,
      this.frameStage,
      pins
    );
    if (this.frameStage === 1 || pins === 10) {
      if (
        this.currentFrame === 9 &&
        this.players.length - 1 === this.currentPlayerIndex
      ) {
        this.isGameEnded = true;
      } else {
        this.frameStage = 0;
        if (this.players.length - 1 > this.currentPlayerIndex) {
          this.currentPlayerIndex = this.currentPlayerIndex + 1;
        } else {
          this.currentPlayerIndex = 0;
          this.currentFrame = this.currentFrame + 1;
        }
      }
    } else {
      this.frameStage = 1;
    }
  }

  public get getWinner(): string {
    return this.getPlayers.sort((a, b) => b.totalScore - a.totalScore)[0].name;
  }
}
