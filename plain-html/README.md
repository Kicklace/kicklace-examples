# A plain HTML page

Kicklace is an AI-powered CRM and customer platform for micro SaaS companies.
This is the smallest hookup there is: one script tag in the `<head>`, and one
form Kicklace hears without you writing a line of JavaScript.

There is nothing to install and nothing to build. Open `index.html` in a
browser, or drop it on any static host.

## What to change

1. In `index.html`, replace `YOUR_PUBLIC_KEY` in the script tag with the public
   key from your workspace, under **Settings → Your website**. That screen
   shows the whole line with the key already in it.
2. Change `data-kl-list="product-updates"` to the address of one of your own
   lists, from **Settings → Lists**.
3. Change the sentence on the consent checkbox to whatever you really promise.
4. Add your site's address under **Settings → Your website → Where is your
   site?**, or every post is refused — on purpose, so that nobody else's page
   can put people in your workspace.

## What happens

| On the page | In Kicklace |
| --- | --- |
| Somebody reads the page | A visitor record, with where they came from |
| They fill the form in | They join `product-updates`, at the Subscriber stage |
| They tick the box | The words on the label are stored verbatim as the proof |

The tag hears the submit on the **capture phase**, which runs before anything
on your page can cancel it, and it never calls `preventDefault`. Your form
validates, submits and shows its own success exactly as it did before the tag
was there.

The consent sentence is not configured anywhere: it is read off the label of
the ticked required checkbox. So what a person read and what Kicklace keeps as
the proof are one sentence, with nowhere for the two to drift apart. Without a
ticked box the person is still recorded, with their address and on no list, and
nothing may email them.

## The form on this page

It ends with six lines of script that stop the browser navigating away and show
a thank-you, because this page has no server behind it. **Delete them.** On a
real site the form keeps whatever `action` it already had — your own handler, a
form service, your site builder's endpoint — and Kicklace does not take it
over.

## If nothing arrives

Open the browser console. A refused post says why in one sentence, with the
screen that fixes it. The usual answer is that the site's address is not on the
workspace's list yet.

## Where the tag goes on a site builder

Webflow, Framer, WordPress, Squarespace, Carrd and the rest each have their own
box for it: <https://www.kicklace.com/docs/site-platforms>.

MIT
