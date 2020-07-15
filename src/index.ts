import  {parseStringPromise} from 'xml2js'
import fetch from 'node-fetch';

export class Votd {
    apiKeys: APIKeys;

    /**
     *
     * @param keys - Some methods may require an API key
     */
    constructor(keys?: APIKeys) {
        this.apiKeys = keys || {};
    }

    initializeKeys(apiKeys: APIKeys) {
        this.apiKeys =  apiKeys;
    }

    /**
     * Requires an API Key to have been initialized
     * Activate one at https://developers.youversion.com/
     */
    getYouVersion(): Promise<VOTD> {
        return new Promise<VOTD>((resolve, reject) =>{
            fetch('https://developers.youversionapi.com/1.0/verse_of_the_day/1?version_id=1', {
                headers: {
                    'X-YouVersion-Developer-Token': `${this.apiKeys.YouVersion}`,
                    'Accept-Language': 'en',
                    Accept: 'application/json',
                }
            })
                .then((result) => result.json())
                .then((json) =>{
                    let obj: YouVersionVOTD = json;
                    let date = new Date();
                    let response: VOTD = {
                        mainPage: "https://www.bible.com",
                        verseRef: obj.verse.human_reference,
                        imageURL: obj.image.url.substring(56),
                        source: "YouVersion",
                        date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
                    }
                    resolve(response)
                })
                .catch(err => reject(err));
        })
    }

    getBibleGateway(): Promise<VOTD>{
        return new Promise<VOTD>((resolve, reject) => {
            fetch('http://www.biblegateway.com/usage/votd/rss/votd.rdf?$version_id')
                .then(res => res.text())
                .then(res => parseStringPromise(res))
                .then(res =>{
                    let verse = res.rss.channel[0].item[0].title[0]
                    let date = new Date();
                    let votd: VOTD = {
                        mainPage: "https://www.biblegateway.com/",
                        date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`,
                        source: "BibleGateway",
                        verseRef: verse
                    }
                    resolve(votd)
                })
                .catch(err => reject(err))
        })
    }
    /**
     * No API key required
     *
     * They seem to not update this endpoint
     */
    getOurManna(): Promise<VOTD> {
        return new Promise<VOTD>((resolve, reject) => {
            fetch('https://beta.ourmanna.com/api/v1/get/?format=json')
                .then(res => res.json())
                .then(res =>{
                    let temp: OurMannaVOTD = res;
                    let date = new Date();
                    let response: VOTD = {
                        mainPage: "http://www.ourmanna.com/",
                        date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`,
                        source: "OurManna",
                        verseRef:  temp.verse.details.reference
                    }
                    resolve(response)
                })
                .catch(err => reject(err))
        })
    }

    getBibleOrg(): Promise<VOTD> {
        return new Promise<VOTD>((resolve, reject) => {
            fetch('https://labs.bible.org/api/?passage=votd&type=json')
                .then(res => res.json())
                .then(res =>{

                    let votd: BibleOrgVOTD[] = res;
                    let date = new Date();
                    let bookname = votd[0].bookname;
                    let chapter = votd[0].chapter;
                    let startingVerse = votd[0].verse;
                    let endingVerse = "";
                    if (votd.length > 1) {
                        endingVerse = `-${startingVerse + votd.length - 1}`
                    }
                    let response: VOTD = {
                        mainPage: "https://bible.org/",
                        verseRef: `${bookname} ${chapter}:${startingVerse}${endingVerse}`,
                        date: `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`,
                        source: "Bible.org"
                    }
                    resolve(response)
                })
                .catch(err => reject(err))
        })
    }
}


interface VOTD {
    source: string,
    mainPage: string,
    /**
     * MM/DD/YYYY
     */
    date: string,
    verseRef: string
    imageURL?: string
}


interface APIKeys {
    'YouVersion'?: string,
}
interface OurMannaVOTD {
    verse: {
        details: {
            text: string
            reference: string,
            version: string,
            verseurl: string
        }
        notice: string
    }
}
interface YouVersionVOTD {
    day: number,
    image: {
        attribution: string,
        url: string
    }
    verse: {
        usfms: [string],
        text: string
        human_reference: string,
        html: null,
        url: string
    }
}

interface BibleOrgVOTD {
        bookname: string,
        chapter: number,
        verse: number,
        text: string
}

