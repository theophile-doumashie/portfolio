// Redirige tout acces via *.pages.dev (production et previews) vers le domaine
// final, afin d'eviter le contenu duplique. Les redirections d'hote ne sont pas
// supportees par le fichier _redirects sur Cloudflare Pages.

const DOMAINE_FINAL = "theophile.stagebroad.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname.endsWith(".pages.dev")) {
    url.hostname = DOMAINE_FINAL;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
