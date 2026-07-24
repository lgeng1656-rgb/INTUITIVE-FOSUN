const QUIET_VOLUME = 0.015;
const LOUD_VOLUME = 0.215;
const SLOW_DURATION = 5.5;
const FAST_DURATION = 1.2;

export function getBreathDuration(volume) {
  const normalized = Math.min(
    1,
    Math.max(0, (volume - QUIET_VOLUME) / (LOUD_VOLUME - QUIET_VOLUME))
  );
  return Number((SLOW_DURATION - normalized * (SLOW_DURATION - FAST_DURATION)).toFixed(2));
}

export function smoothAmbientVolume(current, next) {
  const smoothing = next > current ? 0.25 : 0.08;
  return Number((current + (next - current) * smoothing).toFixed(4));
}
