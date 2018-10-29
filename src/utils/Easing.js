/**
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 *
 * https://gist.github.com/gre/1650294
 */
export default {
  // No easing, no acceleration
  linear(t) {
    return t;
  },

  // Accelerating from zero velocity
  easeInQuad(t) {
    return t * t;
  },

  // Decelerating to zero velocity
  easeOutQuad(t) {
    return t * (2 - t);
  },

  // Acceleration until halfway, then deceleration
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  // Accelerating from zero velocity
  easeInCubic(t) {
    return t * t * t;
  },

  // Decelerating to zero velocity
  easeOutCubic(t) {
    return --t * t * t + 1;
  },

  // Acceleration until halfway, then deceleration
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },

  // Accelerating from zero velocity
  easeInQuart(t) {
    return t * t * t * t;
  },

  // Decelerating to zero velocity
  easeOutQuart(t) {
    return 1 - --t * t * t * t;
  },

  // Acceleration until halfway, then deceleration
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
  },

  // Accelerating from zero velocity
  easeInQuint(t) {
    return t * t * t * t * t;
  },

  // Decelerating to zero velocity
  easeOutQuint(t) {
    return 1 + --t * t * t * t * t;
  },

  // Acceleration until halfway, then deceleration
  easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
  }
};
