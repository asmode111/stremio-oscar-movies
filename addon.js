const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    "id": "org.stremio.oscarmovies",
    "version": "1.0.4",

    "name": "Oscar Movies",
    "description": "Oscar Nominees of the year",

    //"icon": "URL to 256x256 monochrome png icon",
    //"background": "URL to 1024x786 png/jpg background",

    // set what type of resources we will return
    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"], // your add-on will be preferred for these content types

    // set catalogs, we'll have 2 catalogs in this case, 1 for movies and 1 for series
    "catalogs": [
        {
            type: 'movie',
            id: 'oscarmovies'
        },
        {
            type: 'animated',
            id: 'oscaranimated'
        },
        {
            type: 'documentary',
            id: 'oscardocumentary'
        },
        {
            type: 'shortfilm',
            id: 'oscarshortfilm'
        }
    ],

    // prefix of item IDs (ie: "tt0032138")
    "idPrefixes": ["tt"]
};

const builder = new addonBuilder(manifest);


const dataset = {
    "tt1950186": {
        name: "Ford v Ferrari",
        type: "movie",
        description: "American car designer Carroll Shelby and driver Ken Miles battle corporate interference and the laws of physics to build a revolutionary race car for Ford in order to defeat Ferrari at the 24 Hours of Le Mans in 1966.",
        // country: "USA, France",
        releaseInfo: "2019",
        imdbRating: "8.2/10",
        // awards: "Won 2 Oscars. Another 21 wins & 69 nominations.",
        genres: [
            "Action",
            "Biography",
            "Drama",
            "Sport"
        ],
        director: [
            "James Mangold"
        ]
    },
    "tt1302006": {
        name: "The Irishman",
        type: "movie",
        description: "A mob hitman recalls his friend Jimmy Hoffa.",
        // country: "USA",
        releaseInfo: "2019",
        imdbRating: "8.0/10",
        // awards: "Nominated for 10 Oscars. Another 62 wins & 298 nominations.",
        genres: [
            "Biography",
            "Crime",
            "Drama"
        ],
        director: [
            "Martin Scorsese"
        ]
    },
};

builder.defineStreamHandler(function (args) {
    if (dataset[args.id]) {
        return Promise.resolve({streams: [dataset[args.id]]});
    } else {
        return Promise.resolve({streams: []});
    }
})

const METAHUB_URL = "https://images.metahub.space"

const generateMetaPreview = function (value, key) {
    // To provide basic meta for our movies for the catalog
    // we'll fetch the poster from Stremio's MetaHub
    // see https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/meta.md#meta-preview-object
    const imdbId = key.split(":")[0]
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        description: value.description,
        director: value.director,
        genres: value.genres,
        releaseInfo: value.releaseInfo,
        imdbRating: value.imdbRating,
        awards: value.awards,
        poster: METAHUB_URL + "/poster/medium/" + imdbId + "/img"
    }
}

builder.defineCatalogHandler(function (args, cb) {
    // filter the dataset object and only take the requested type
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key))

    return Promise.resolve({metas: metas})
})

module.exports = builder.getInterface()
