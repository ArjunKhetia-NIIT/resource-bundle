# Resource Bundle Project

The quickest way to fetch Resource Bundle from Phrase App just clone the project:

```bash
$ git clone https://github.com/ArjunKhetia-NIIT/resource-bundle.git
```

Install dependencies:

```bash
$ npm install
```

To generate resource bundle run the command with 4 parameters as per your requirements

1) authToken - Phrase access token in string format.
2) project - Phrase Project Name in string format.
3) locale - Locales you want to download in comma separated format.
4) fileformat - File format in which you want all the locales. (eg: properties, nested_json, json, etc.)

Optional parameter you can pass

5) distFolder - Specify the dist folder name you want to generate the locale files inside.
6) merge - Merge is only available for JSON format files which can merge the locale files from different projects into single file with renaming file name to the first 2 letter of the particular locale. (eg: en.json, hi.json, etc.)

(Note: It supports "UTF-8", "UTF-16" and "ISO-8859-1" Formats.)

```bash
$ node index.js -authToken='Basic YXJqdW3raGV1aWE7QXJqdW9AMTk1MA==' -project='Project Name, Other Project Name' -locale='en,gu,hi,ur,bn' -fileformat='json' -merge='true' -distFolder='distFolder'
```

If you don't pass the distFolder parameter then output files will be generated inside "sunbirdresourcebundle" folder, with "{Project_Name} - {locale}.{format}" name.