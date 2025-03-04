export function log(message: string) {
  // TODO: switch to logging plugin later
  console.log(message);
  window.Android.showToast(message);
}
