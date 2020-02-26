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

(Note: It supports "UTF-8", "UTF-16" and "ISO-8859-1" Formats.)

```bash
$ node index.js -authToken='Basic YXJqdW3raGV1aWE7QXJqdW9AMTk1MA==' -project='Project Name' -locale='en,gu,hi,ur,bn' -fileformat='json'
```

Output files will be generated inside "sunbirdresourcebundle" folder.