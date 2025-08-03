import type { EventBus } from '../events/EventBus.js';
import type { FoundryLogger } from '../../../lib/log4foundry/log4foundry.js';
import type { InitialisableService } from '../../domain/interfaces/InitialisableService.js';

import { LoggerFactory } from '../../../lib/log4foundry/log4foundry.js';
import { MODULE_ID } from '../../config.js';

/**
 * Infrastructure service responsible for anguish bar behaviour.
 */
export class AnguishBarService implements InitialisableService {
    private readonly eventBus: EventBus;
    private readonly logger: FoundryLogger;
    private initialised = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.logger = LoggerFactory.getInstance().getFoundryLogger(`${MODULE_ID}.AnguishBarService`);
    }

    /**
     * Initialises the service by registering event handlers.
     */
    async initialise(): Promise<void> {
        if (this.initialised) {
            this.logger.warn('AnguishBarService already initialised');
            return;
        }
        
        this.registerEventHandlers();
        this.initialised = true;
        this.logger.info('AnguishBarService initialised');
    }

    /**
     * Registers event handlers for character sheet events.
     */
    private registerEventHandlers(): void {
        this.logger.debug('AnguishBarService event handlers registered');
    }
}