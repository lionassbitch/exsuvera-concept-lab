export function ScrollProgress() {
  return (
    <div
      className="rd-progress"
      data-scroll-progress=""
      role="progressbar"
      aria-label="Page scroll"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <span />
    </div>
  );
}
