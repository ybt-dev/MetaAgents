import { uniqueId } from 'lodash';

export interface Transaction {
  getId(): string;
  getEffects(): Array<() => Promise<void>>;
  registerEffect(effect: () => Promise<void>): void;
  clearEffects(): void;
}

export abstract class AbstractTransaction implements Transaction {
  private readonly id: string = uniqueId();
  private effects: Array<() => Promise<void>> = [];

  public registerEffect(effect: () => Promise<void>): void {
    this.effects.push(effect);
  }

  public clearEffects(): void {
    this.effects = [];
  }

  public getEffects() {
    return this.effects;
  }

  public getId(): string {
    return this.id;
  }
}
