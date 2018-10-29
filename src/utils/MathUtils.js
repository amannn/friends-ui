import Easing from './Easing';

export default {
  /**
   * Pushes target away from the source on the
   * horizontal axis so the two don't collide.
   * @param {Object} sourceOrigin
   * @param {Object} targetOrigin
   * @param {Number} originSize
   * @param {Number} minDistance
   * @return {Object} The updated origin for the target.
   */
  applyRepulsion(sourceOrigin, targetOrigin, originSize, minDistance = 40) {
    const minOriginDistance = originSize + minDistance;

    const dx = Math.abs(targetOrigin.x - sourceOrigin.x);
    const dy = Math.abs(targetOrigin.y - sourceOrigin.y);
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    let repulsion = 0;
    if (d < minOriginDistance) {
      const newX = Math.sqrt(Math.pow(minOriginDistance, 2) - Math.pow(dy, 2));
      repulsion = newX - dx;
      repulsion = Easing.easeInQuad(repulsion / originSize) * originSize;
      if (targetOrigin.x < sourceOrigin.x) repulsion *= -1;
    }

    return {
      y: targetOrigin.y,
      x: targetOrigin.x + repulsion
    };
  },

  clamp(value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    }

    return value;
  },

  interpolateRange({
    inputStart = 0,
    inputEnd = 1,
    outputStart = 0,
    outputEnd = 1,
    current,
    clamp = true
  }) {
    let progress = (current - inputStart) / (inputEnd - inputStart);

    if (clamp) {
      progress = this.clamp(progress, 0, 1);
    }

    return this.interpolate(outputStart, outputEnd, progress);
  },

  interpolate(min, max, progress) {
    return min + (max - min) * progress;
  },

  radiantToDegress(radiant) {
    return radiant * (180 / Math.PI);
  }
};
