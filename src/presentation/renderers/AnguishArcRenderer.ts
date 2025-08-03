import type { OverlayRenderContext } from '../../domain/interfaces/OverlayRenderContext.js';

import * as PIXI from 'pixi.js';
import { MODULE_ID } from '../../config.js';
import { LoggerFactory, type FoundryLogger } from '../../../lib/log4foundry/log4foundry.js';
import { RenderingUtility } from '../utils/RenderingUtility.js';

export class AnguishArcRenderer {
  private readonly logger: FoundryLogger;

  constructor() {
    this.logger = LoggerFactory.getInstance().getFoundryLogger(`${MODULE_ID}.AnguishArcRenderer`);
  }

  /**
   * Render anguish arc into the provided graphics object
   */
  render(graphics: PIXI.Graphics, context: OverlayRenderContext): void {
    graphics.clear();

    if (!context.anguishInfo) {
      this.logger.warn('No anguish info provided in context');
      return;
    }

    const anguishInfo = context.anguishInfo;
    const radius = anguishInfo.arcRadius;
    const arcWidth = anguishInfo.arcWidth;

    const backgroundStartRadians = (anguishInfo.backgroundStartAngle * Math.PI) / 180;
    const backgroundEndRadians = (anguishInfo.backgroundEndAngle * Math.PI) / 180;
    const anguishArcStartRadians = (anguishInfo.anguishArcStartAngle * Math.PI) / 180;
    const anguishArcEndRadians = (anguishInfo.anguishArcEndAngle * Math.PI) / 180;

    if (Math.abs(backgroundEndRadians - backgroundStartRadians) > 0.001) {
      graphics.beginFill(0, 0);
      const backgroundColour = RenderingUtility.transformColour(anguishInfo.backgroundColour);
      graphics.lineStyle({
        width: arcWidth,
        color: backgroundColour,
        alpha: 0.5,
        cap: PIXI.LINE_CAP.BUTT
      });

      graphics.arc(0, 0, radius, backgroundStartRadians, backgroundEndRadians, anguishInfo.anticlockwise);
      graphics.endFill();
    }

    if (Math.abs(anguishArcEndRadians - anguishArcStartRadians) > 0.001) {
      const lowColour = RenderingUtility.transformColour(anguishInfo.lowAnguishArcColour);
      const midColour = RenderingUtility.transformColour(anguishInfo.midAnguishArcColour);
      const highColour = RenderingUtility.transformColour(anguishInfo.highAnguishArcColour);
      
      const anguishPercentage = anguishInfo.anguishPercentage ?? 0;
      
      RenderingUtility.renderGradientArc(
        graphics,
        anguishArcStartRadians,
        anguishArcEndRadians,
        radius,
        arcWidth,
        lowColour,
        midColour,
        highColour,
        anguishPercentage,
        anguishInfo.anticlockwise
      );
    }

    this.logger.debug('Rendered anguish arc', {
      radius,
      arcWidth,
      anticlockwise: anguishInfo.anticlockwise,
      anguishPercentage: anguishInfo.anguishPercentage,
      anguishInfo
    });
  }
}