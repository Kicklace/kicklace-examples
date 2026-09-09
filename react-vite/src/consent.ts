// The list, and the words on the form.
//
// One constant, read by the checkbox that shows it and by the call that sends
// it, so consent shown and consent stored can never be two different
// sentences. Kicklace keeps the text verbatim as the proof, with the day; a
// subscribe with no consent is refused (`missing_consent`).
//
// Change LIST to the address of a list in your workspace (Settings → Lists)
// and CONSENT to whatever you really promise.
export const LIST = "product-updates";

export const CONSENT =
  "Email me when there is something new to try. I can unsubscribe with one click.";
