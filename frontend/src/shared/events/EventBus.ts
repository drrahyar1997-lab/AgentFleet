import Phaser from 'phaser';

type EventCallback<Args extends unknown[] = never[]> = (...args: Args) => void;

class GameEventBus {
  private emitter = new Phaser.Events.EventEmitter();
  private gameInstance: Phaser.Game | null = null;

  setGameInstance(game: Phaser.Game) {
    this.gameInstance = game;
  }

  getGameInstance(): Phaser.Game | null {
    return this.gameInstance;
  }

  emit<Args extends unknown[]>(event: string, ...args: Args) {
    this.emitter.emit(event, ...args);
  }

  on<Args extends unknown[]>(event: string, callback: EventCallback<Args>, context?: object) {
    this.emitter.on(event, callback, context);
  }

  once<Args extends unknown[]>(event: string, callback: EventCallback<Args>, context?: object) {
    this.emitter.once(event, callback, context);
  }

  off<Args extends unknown[]>(event: string, callback?: EventCallback<Args>, context?: object) {
    this.emitter.off(event, callback, context);
  }
}

export const EventBus = new GameEventBus();
