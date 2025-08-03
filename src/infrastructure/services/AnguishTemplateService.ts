import type { FoundryLogger } from '../../../lib/log4foundry/log4foundry.js';
import type { InitialisableService } from '../../domain/interfaces/InitialisableService.js';

import { LoggerFactory } from '../../../lib/log4foundry/log4foundry.js';
import { MODULE_ID } from '../../config.js';
import { ActorAdapterFactory } from '../factories/ActorAdapterFactory.js';
import { Actor } from '../../domain/entities/Actor.js';

/**
 * Infrastructure service responsible for registering anguish-related Handlebars helpers.
 * Bridges domain Actor entity with presentation layer.
 */
export class AnguishTemplateService implements InitialisableService {
    private readonly logger: FoundryLogger;
    private initialised = false;

    constructor() {
        this.logger = LoggerFactory.getInstance().getFoundryLogger(`${MODULE_ID}.AnguishTemplateService`);
    }

    async initialise(): Promise<void> {
        if (this.initialised) {
            this.logger.warn('AnguishTemplateService already initialised');
            return;
        }

        this.registerHandlebarsHelpers();
        this.initialised = true;
        this.logger.info('AnguishTemplateService initialised');
    }

    /**
     * Registers Handlebars helpers that use domain Actor entity.
     * Updated to match DnD5e HTML structure whilst using domain model.
     */
    private registerHandlebarsHelpers(): void {
        Handlebars.registerHelper('anguishBar', (foundryActor: foundry.documents.Actor) => {
            try {
                if (!foundryActor.id) {
                    this.logger.warn('No actor provided to anguishBar helper');

                    return '';
                }

                const actorAdapter = ActorAdapterFactory.create(foundryActor.id);
                if (!actorAdapter) {
                    this.logger.warn(`Could not create actor adapter for ID ${foundryActor.id}`);

                    return '';
                }

                const domainActor = new Actor(actorAdapter);
                const anguish = domainActor.getAnguish();

                // Match DnD5e meter structure exactly
                return new Handlebars.SafeString(`
                    <div class="meter-group">
                        <div class="label roboto-condensed-upper">
                            <span>${game.i18n.localize(`${MODULE_ID}.anguishBar.name`)}</span>
                        </div>
                        <div class="meter hit-points" role="meter" 
                            aria-label="${game.i18n.localize(`${MODULE_ID}.anguishBar.name`)} ${anguish.current} / ${anguish.max}" 
                            aria-valuemin="0" 
                            aria-valuenow="${anguish.current}" 
                            aria-valuemax="${anguish.max}">
                            <div class="progress anguish" style="--bar-percentage: ${anguish.percentage.toFixed(1)}%">
                                <div class="label">
                                    <span class="value">${anguish.current}</span>
                                    <span class="separator">/</span>
                                    <span class="max">${anguish.max}</span>
                                </div>
                                <input type="text" 
                                    name="flags.${MODULE_ID}.anguish.value" 
                                    value="${anguish.current}" 
                                    placeholder="0"
                                    data-dtype="Number"
                                    hidden>
                            </div>
                        </div>
                    </div>
                    `);
            } catch (error) {
                this.logger.error('Error generating anguish bar template', error);
                return '';
            }
        });

        this.logger.debug('Handlebars helpers registered for anguish');
    }
}