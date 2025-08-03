import { AbstractDomainEvent } from './AbstractDomainEvent.js';
import type { Anguish } from '../value-objects/Anguish.js';

export interface AnguishChangedEventProps {
  actorId: string;
  previousAnguish: Anguish;
  currentAnguish: Anguish;
}

export class AnguishChangedEvent extends AbstractDomainEvent<AnguishChangedEventProps> {
  static readonly eventName = 'anguish.changed' as const;

  get actorId(): string {
    return this.props.actorId;
  }

  get previousAnguish(): Anguish {
    return this.props.previousAnguish;
  }

  get currentAnguish(): Anguish {
    return this.props.currentAnguish;
  }

  /**
   * Check if anguish has increased
   */
  get hasIncreased(): boolean {
    return this.currentAnguish.current > this.previousAnguish.current;
  }

  /**
   * Get the change amount
   */
  get changeAmount(): number {
    return this.currentAnguish.current - this.previousAnguish.current;
  }

  /**
   * Check if a threshold was crossed
   */
  hasPassedThreshold(threshold: number): boolean {
    return this.previousAnguish.percentage < threshold && 
           this.currentAnguish.percentage >= threshold;
  }

  /**
   * Get percentage change
   */
  get percentageChange(): number {
    return this.currentAnguish.percentage - this.previousAnguish.percentage;
  }
}