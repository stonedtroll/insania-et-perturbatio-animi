import type { EventBus } from '../../infrastructure/events/EventBus.js';
import type { TokenRepository } from '../../infrastructure/repositories/TokenRepository.js';
import type { FoundryLogger } from '../../../lib/log4foundry/log4foundry.js';
import { LoggerFactory } from '../../../lib/log4foundry/log4foundry.js';
import { MODULE_ID } from '../../config.js';
import type { InitialisableService } from '../../domain/interfaces/InitialisableService.js';

/**
 * Application layer coordinator for anguish-related business logic.
 */
export class AnguishCoordinator implements InitialisableService {
    private readonly eventBus: EventBus;
    private readonly tokenRepository: TokenRepository;
    private readonly logger: FoundryLogger;
    private initialised = false;

    constructor(eventBus: EventBus, tokenRepository: TokenRepository) {
        this.eventBus = eventBus;
        this.tokenRepository = tokenRepository;
        this.logger = LoggerFactory.getInstance().getFoundryLogger(`${MODULE_ID}.AnguishCoordinator`);
    }

    /**
     * Initialises the coordinator by registering event handlers.
     */
    async initialise(): Promise<void> {
        if (this.initialised) {
            this.logger.warn('AnguishCoordinator already initialised');
            return;
        }
        
        this.registerEventHandlers();
        this.initialised = true;
        this.logger.info('AnguishCoordinator initialised');
    }

    /**
     * Registers event handlers for business logic only.
     */
    private registerEventHandlers(): void {
    }

    /**
     * Handles actor update events 
     */
    private async handleActorUpdate(event: ActorUpdateEvent): Promise<void> {
    }

}