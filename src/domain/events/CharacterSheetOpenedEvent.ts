import { AbstractDomainEvent } from './AbstractDomainEvent.js';

export interface CharacterSheetProps {
    actorId: string;
    appId: string;
}

export class CharacterSheetOpenedEvent extends AbstractDomainEvent<CharacterSheetProps> {
    static readonly eventName = 'characterSheet.opened' as const;

    get actorId(): string {
        return this.props.actorId;
    }

    get appId(): string {
        return this.props.appId;
    }

}
