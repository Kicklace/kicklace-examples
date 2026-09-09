// The list, and the words on the form.
//
// One constant, read by whatever shows it and by the handler that stores it,
// so consent shown and consent stored can never be two different sentences.
// Kicklace keeps the text verbatim as the proof, with the day and, if you send
// it, their IP. A subscribe with no consent is refused (`missing_consent`),
// and a list's own wording is not a substitute for what this person saw.
//
// Change LIST to the address of a list in your workspace (Settings → Lists)
// and CONSENT to whatever your form really says.
export const LIST = "product-updates";

export const CONSENT =
  "Email me when there is something new to try. I can unsubscribe with one click.";
