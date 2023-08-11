// import SiteConfig from "../site.json"
// import to make sure copy the site.json file
import SiteConfig from "../site.json"

// const fs = require('fs');
// const path = require('path');

// let SiteConfig = undefined;
// try {
//     let jsonPath = path.join(__dirname, "../../../../site.json");
//     if (process.env.NODE_ENV === 'development') {
//         jsonPath = path.join(__dirname, "../../../../site.json");
//       }
//     SiteConfig = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
// } catch (error) {
//     console.log(error)
// }

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