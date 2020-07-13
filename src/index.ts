import fetch from 'node-fetch';

export class Votd {
    apiKeys: APIKeys;

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
    getYouVersion(): Promise<YouVersionVOTD> {
        return new Promise<YouVersionVOTD>((resolve, reject) =>{
            fetch('https://developers.youversionapi.com/1.0/verse_of_the_day/1?version_id=1', {
                headers: {
                    'X-YouVersion-Developer-Token': `${this.apiKeys.YouVersion}`,
                    'Accept-Language': 'en',
                    Accept: 'application/json',
                }
            })
                .then((result) => result.json())
                .then((json) => resolve(json))
                .catch(err => reject(err));
        })
    }

    /**
     * No API key required
     */
    getOurManna(): Promise<OurMannaVOTD> {
        return new Promise<OurMannaVOTD>((resolve, reject) => {
        fetch('https://beta.ourmanna.com/api/v1/get/?format=json')
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err))
        })
    }

    getBibleOrg(): Promise<BibleOrgVOTD> {
        return new Promise<BibleOrgVOTD>((resolve, reject) => {
            fetch('https://labs.bible.org/api/?passage=votd&type=json')
                .then(res => res.json())
                .then(res =>{


                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }
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
    [index: number]: {
        bookname: string,
        chapter: number,
        verse: number,
        text: string
    }

}