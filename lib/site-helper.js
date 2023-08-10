import SiteConfig from "../site.json"

export function getSiteTitle() {
    const siteTitle = SiteConfig.title;
    return siteTitle
}

export function getIconRedirectUrl() {
    const siteIconRedirectUrl = SiteConfig.icon_redirect_url;
    return siteIconRedirectUrl
}