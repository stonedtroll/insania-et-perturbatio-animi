import type { OverlayDefinition } from '../../../domain/interfaces/OverlayDefinition.js';

export const AnguishArcDefinition: OverlayDefinition = {
  id: 'anguish-arc',
  name: 'Anguish Arc',
  description: 'Visual arc indicator showing token anguish percentage',
  category: 'status',
  enabledByDefault: true,
  visibleOnStart: true,
  renderLayer: 'drawings',
  renderOnTokenMesh: false,
  zIndex: 500,
  
  permissions: {
    requireLOS: false,
    requireGM: false,
    requireOwnership: false,
    requireControl: false
  },

  displayOn: {
    gridless: true,
    square: true,
    hexFlat: true,
    hexPointy: true
  },

  triggers: {
    keyPress: {
      keys: ['m'],
      scope: 'owned'
    }
  },

  updateOn: {
    tokenMove: true,
    tokenRotate: false,
    visionChange: false,
    wallChange: false,
    gridChange: false
  }
};