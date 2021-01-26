# mapbox-materialise-style-language

A CLI program which given a Mapbox Style in English, creates new styles for each supported language.

## Usage

```sh
yarn add -g mapbox-materialise-style-language
mapbox-materialise-style-language [--access-token 'sk.XXX'] --owner XXX --style XXX
```

The access token must have the `style:write` scope and can be supplied via the command line argument or via the `MapboxAccessToken` environment variable.
