# Instant search

Instant Search is a simple and very lightweight WordPress plugin for instant search results.
**There are no settings**, plugin will hook itself on the first search form and that may or may not work well depending on your theme. Tested with Storefront theme. Change CSS and other things if needed to reposition elements better. jQuery is not used so be sure to test if you need to support ancient browsers (at least Edge 12).

## Requirements

You need to install [WP Rest Api V2 Multiple PostTypes](https://wordpress.org/plugins/wp-api-multiple-posttype/), because both posts and pages are searchable which to my understand currently is not possible without a plugin. If you wish to change querying modify searchQueryparams to your needs in /assets/instant-search.js