# votd-retriever
Verse of the day retriever retrieves verses from different sites in the 
most direct fashion.
### Supported sites
- YouVersion (bible.com) 
- Bible.org
- BibleGateway.com
- Ourmanna.com

If you want to add a site to retrieve a verse from please send a pull request, 
this is mainly for aggregation.

### Usage
Installation:
```
npm install votd-retriever
...
let {Votd} = require('./index.js')
```
Use: 
```
let votd = new Votd({
    YouVersion: "APIKEY" //YouVersion is the only site requiring an API Key
});

votd.getYouVersion()
    .then(res => console.log(res))

```
Response Format:
```
interface VOTD {
    /**
     * The name of the site/company choosing specific VOTD.
     */
    source: string,
    /**
     * The web homepage of the site creating the VOTD.
     */
    mainPage: string,
    /**
     * MM/DD/YYYY
     */
    date: string,
    verseRef: string
    imageURL?: string
}
```
## Eventual Goals:
- Add daily devotionals
- Add more sites (more immediate)
- Begin Parsing HTML for sites that do not have an RSS feed or REST API