import type { OverlayContextBuilder } from '../../../domain/interfaces/OverlayContextBuilder.js';
import type { Token } from '../../../domain/entities/Token.js';
import type { OverlayRenderContext } from '../../../domain/interfaces/OverlayRenderContext.js';
import type { OverlayDefinition } from '../../../domain/interfaces/OverlayDefinition.js';

interface AnguishArcContextOptions {
    anguishArcStartAngle: number;
    anguishArcEndAngle: number;
    anguishPercentage: number; 
    lowAnguishArcColour: string;
    midAnguishArcColour: string;
    highAnguishArcColour: string;
    backgroundStartAngle: number;
    backgroundEndAngle: number;
    backgroundColour: string;
    arcRadius: number;
    arcWidth: number;
    anticlockwise: boolean;
}

/**
 * Context builder for anguish arc overlays.
 */
export class AnguishArcContextBuilder implements OverlayContextBuilder<AnguishArcContextOptions> {
    buildContext(
        token: Token,
        overlayDefinition: OverlayDefinition,
        options: AnguishArcContextOptions
    ): OverlayRenderContext {

        const baseContext: OverlayRenderContext = {
            overlayTypeId: 'anguish-arc',
            renderLayer: overlayDefinition.renderLayer,
            renderOnTokenMesh: overlayDefinition.renderOnTokenMesh,
            zIndex: overlayDefinition.zIndex,
            ...(overlayDefinition.styling && { styling: overlayDefinition.styling }),
            overlayCentre: {
                x: token.centre.x,
                y: token.centre.y
            },
            token: {
                id: token.id,
                name: token.name,
                position: {
                    x: token.position.x,
                    y: token.position.y
                },
                width: token.width,
                height: token.height,
                centre: {
                    x: token.centre.x,
                    y: token.centre.y
                },
                radius: token.radius
            }
        };

        if (!options) {
            return baseContext;
        }

        return {
            ...baseContext,
            anguishInfo: {
                anguishArcStartAngle: options.anguishArcStartAngle,
                anguishArcEndAngle: options.anguishArcEndAngle,
                anguishPercentage: options.anguishPercentage,
                lowAnguishArcColour: options.lowAnguishArcColour,
                midAnguishArcColour: options.midAnguishArcColour,
                highAnguishArcColour: options.highAnguishArcColour,
                backgroundStartAngle: options.backgroundStartAngle,
                backgroundEndAngle: options.backgroundEndAngle,
                backgroundColour: options.backgroundColour,
                arcRadius: options.arcRadius,
                arcWidth: options.arcWidth,
                anticlockwise: options.anticlockwise
            }
        };
    }
}