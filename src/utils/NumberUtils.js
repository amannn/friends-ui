export default {
  clamp(value, min, max) {
    if (value < min) {
      return min;
    } else if (value > max) {
      return max;
    }

    return value;
  },

  interpolateRange({
    inputStart,
    inputEnd,
    outputStart,
    outputEnd,
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
