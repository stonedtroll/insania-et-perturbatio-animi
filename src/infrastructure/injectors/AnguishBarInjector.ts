import type { EventBus } from '../events/EventBus.js';
import type { FoundryLogger } from '../../../lib/log4foundry/log4foundry.js';
import type { InitialisableService } from '../../domain/interfaces/InitialisableService.js';

import { LoggerFactory } from '../../../lib/log4foundry/log4foundry.js';
import { MODULE_ID } from '../../config.js';

/**
 * Infrastructure service responsible for injecting anguish bars into character sheets.
 * Uses Handlebars helper approach for template integration.
 */
export class AnguishBarInjector implements InitialisableService {
    private readonly eventBus: EventBus;
    private readonly logger: FoundryLogger;
    private initialised = false;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.logger = LoggerFactory.getInstance().getFoundryLogger(`${MODULE_ID}.AnguishBarInjector`);
    }

    async initialise(): Promise<void> {
        if (this.initialised) {
            this.logger.warn('AnguishBarInjector already initialised');
            return;
        }

        this.registerFoundryHooks();
        this.initialised = true;
        this.logger.info('AnguishBarInjector initialised');
    }

    /**
     * Registers Foundry hooks for anguish bar injection.
     */
    private registerFoundryHooks(): void {
        Hooks.on('renderActorSheetV2', this.handleAnguishBarInjection.bind(this));

        this.logger.debug('Anguish bar injection hooks registered');
    }

    /**
     * Handles anguish bar injection into character sheets.
     */
    private handleAnguishBarInjection(app: ActorSheet, html: HTMLElement, context: any, options: any): void {
        try {
            if (app.actor?.type !== 'character') {
                this.logger.debug(`Skipping anguish bar injection for non-character actor type: ${app.actor?.type}`);

                return;
            }

            this.logger.debug(`Injecting anguish bar into character sheet for actor ${app.actor.id}`);

            const hpMeterGroup = this.findHpMeterGroup(html);

            if (!hpMeterGroup) {
                this.logger.warn('Could not find HP meter group to inject anguish bar after');

                return;
            }

            const existingAnguishBar = html.querySelector('.progress.anguish');
            if (existingAnguishBar) {
                this.logger.debug('Anguish bar already exists, skipping injection');

                return;
            }

            const anguishBarHtml = Handlebars.helpers.anguishBar(app.actor);

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = anguishBarHtml;
            const anguishBarElement = tempDiv.firstElementChild as HTMLElement;

            if (!anguishBarElement) {
                this.logger.error('Failed to create anguish bar element from template');
                return;
            }

            hpMeterGroup.insertAdjacentElement('afterend', anguishBarElement);

            this.logger.debug(`Anguish bar successfully injected for actor ${app.actor.id}`);

            this.enableFoundryEditBehaviour(anguishBarElement, app);

        } catch (error) {
            this.logger.error('Error injecting anguish bar into character sheet', error);
        }
    }

    /**
     * Finds the HP meter group element.
     */
    private findHpMeterGroup(html: HTMLElement): HTMLElement | null {
        const meterGroups = html.querySelectorAll('.meter-group');

        for (const meterGroup of meterGroups) {
            const hasHitPoints = meterGroup.querySelector('.hit-points') ||
                meterGroup.querySelector('[class*="hit-point"]') ||
                meterGroup.textContent?.toLowerCase().includes('hit points');

            if (hasHitPoints) {
                return meterGroup as HTMLElement;
            }
        }

        // Alternative approach - look for the specific structure
        const hitPointsProgress = html.querySelector('.progress.hit-points');
        if (hitPointsProgress) {
            return hitPointsProgress.closest('.meter-group') as HTMLElement;
        }

        return null;
    }

    /**
     * Enables native Foundry VTT v13 edit behaviour for the anguish bar.
     * Mirrors DnD5e's HP bar editing pattern with value clamping.
     */
    private enableFoundryEditBehaviour(anguishBarElement: HTMLElement, app: ActorSheet): void {
        const progressElement = anguishBarElement.querySelector('.progress.anguish') as HTMLElement;
        const inputElement = progressElement?.querySelector('input[type="text"]') as HTMLInputElement;
        const labelElement = progressElement?.querySelector('.label') as HTMLElement;

        if (!progressElement || !inputElement || !labelElement) {
            this.logger.warn('Could not find required elements for anguish bar editing');
            return;
        }

        let currentValue = parseInt(inputElement.value, 10) || 0;

        progressElement.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            if (!inputElement.hasAttribute('hidden')) {
                return;
            }

            currentValue = parseInt(inputElement.value, 10) || 0;

            inputElement.removeAttribute('hidden');
            labelElement.style.display = 'none';

            inputElement.focus();
            inputElement.select();
        });

        const hideEditMode = (): void => {
            inputElement.setAttribute('hidden', '');
            labelElement.style.display = '';
        };

        const submitValue = (): void => {
            let newValue = parseInt(inputElement.value, 10);
            
            const meterElement = progressElement.closest('[role="meter"]');
            const maxValue = parseInt(meterElement?.getAttribute('aria-valuemax') || '100', 10);
            
            if (isNaN(newValue)) {
                newValue = currentValue;
            } else {
                newValue = Math.max(0, Math.min(newValue, maxValue));
            }

            inputElement.value = newValue.toString();

            hideEditMode();
        };

        // Keyboard event handling
        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Enter':
                    event.preventDefault();
                    submitValue();
                    inputElement.blur(); 
                    break;
                case 'Escape':
                    event.preventDefault();
                    inputElement.value = currentValue.toString();
                    hideEditMode();
                    break;
                case 'Tab':
                    submitValue();
                    break;
            }
        });

        // Input validation on typing (DnD5e pattern)
        inputElement.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            
            let value = target.value.replace(/[^\d-]/g, '');

            if (value.indexOf('-') > 0) {
                value = value.replace(/-/g, '');
            }
            
            // Update input if cleaned
            if (value !== target.value) {
                target.value = value;
            }
        });

        inputElement.addEventListener('blur', () => {
            submitValue();
        });

        // Prevent form submission on Enter
        inputElement.addEventListener('submit', (event: Event) => {
            event.preventDefault();
        });
    }
}