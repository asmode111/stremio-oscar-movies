#!/usr/bin/env node

const { addonBuilder, serveHTTP, publishToCentral } = require('stremio-addon-sdk')
const fs = require('fs');

const manifest = {
    "id": "org.stremio.oscarmovies",
    "version": "1.0.4",
    "name": "Oscar Movies",
    "description": "Oscar Nominees of the year",
    //"icon": "URL to 256x256 monochrome png icon",
    //"background": "URL to 1024x786 png/jpg background",
    "resources": [
        "catalog",
        "stream"
    ],
    "types": ["movie", "series"],
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
    "idPrefixes": ["tt"] // prefix of item IDs (ie: "tt0032138")
};

const builder = new addonBuilder(manifest);
let rawJson = fs.readFileSync('./dataset.json');
let dataset = JSON.parse(rawJson);

builder.defineStreamHandler(function (args) {
    if (dataset[args.id]) {
        return Promise.resolve({streams: [dataset[args.id]]});
    } else {
        return Promise.resolve({streams: []});
    }
})


const generateMetaPreview = function (value, key) {
    const imdbId = key.split(":")[0]
    return {
        id: imdbId,
        type: value.Type,
        name: value.Title,
        description: value.Plot,
        director: [
            value.Director
        ],
        cast: value.Actors.split(','),
        genres: value.Genre.split(','),
        releaseInfo: value.Released,
        imdbRating: value.imdbRating,
        poster: value.Poster
    }
}

builder.defineCatalogHandler(function (args, cb) {
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.Type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key))

    return Promise.resolve({metas: metas})
})

// module.exports = builder.getInterface()
serveHTTP(builder.getInterface(), { port: 7000 })
publishToCentral('https://onurdegerli-stremio-oscar-movies.glitch.me/manifest.json')