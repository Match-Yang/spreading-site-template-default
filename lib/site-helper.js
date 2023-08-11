// import SiteConfig from "../site.json"
// import to make sure copy the site.json file
import sc from "../site.json"

const fs = require('fs');
const path = require('path');
import getConfig from 'next/config'

let SiteConfig = undefined;
try {
    SiteConfig = JSON.parse(fs.readFileSync(path.resolve("./public","..", "site.json"), 'utf8'))
} catch (error) {
    console.log(error)
}

export function getSiteConfig() {
    return SiteConfig;
}

export function getSiteTitle() {
    const siteTitle = SiteConfig.title;
    return siteTitle
}

export function getIconRedirectUrl() {
    const siteIconRedirectUrl = SiteConfig.icon_redirect_url;
    return siteIconRedirectUrl
}