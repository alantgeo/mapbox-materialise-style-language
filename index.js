#!/usr/bin/env node

const argv = require('yargs/yargs')(process.argv.slice(2))
  .demandOption(['owner', 'style'])
  .argv
const deepMap = require('deep-map')
const MapboxStyles = require('@mapbox/mapbox-sdk/services/styles')

const accessToken = argv['access-token'] || process.env.MapboxAccessToken

if (!accessToken) {
  console.error(`Mapbox Access Token must be supplied as either --access-token sk.XXX as a command line argument or via the MapboxAccessToken environment variable`)
}

const stylesService = MapboxStyles({ accessToken })

// https://docs.mapbox.com/vector-tiles/reference/mapbox-streets-v8/#name-text--name_lang-code-text
const languages = ['ar', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh-Hans', 'zh-Hant', 'ja', 'ko', 'vi']

stylesService.getStyle({
  styleId: argv.style,
  ownerId: argv.owner,
  metadata: true,
  draft: false,
  fresh: true,
})
  .send()
  .then(res => {
    const canonicalStyle = res.body

    languages.map(language => {
      console.log(language)
      const localisedStyle = deepMap(canonicalStyle, value => {
        if (value === 'name_en') {
          return `name_${language}`
        } else {
          return value
        }
      })
      localisedStyle.name = `${canonicalStyle.name} ${language}`

      stylesService.createStyle({
        ownerId: argv.owner,
        style: localisedStyle
      })
        .send()
        .then(res => {
          const createdStyle = res.body
          console.log(`"${createdStyle.name}" ${createdStyle.owner}/${createdStyle.id}`)
        }, err => {
          console.error(`Error publishing ${language}`, err)
        })
    })
  }, err => {
    console.error(`Error retrieving ${argv.owner}/${argv.style}`)
  })
