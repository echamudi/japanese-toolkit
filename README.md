# Japanese Db Maker

Japanese language resources database maker from various open source materials.

(This module is still under initial development)

# Usage
1. Download required materials
    - Download `JMdict_e.gz` from http://www.edrdg.org/jmdict/edict_doc.html.
    - Download `JMnedict.xml.gz` from https://www.edrdg.org/enamdict/enamdict_doc.html.

1. Extract all the files and put it in a folder (e.g. `sourceFolder`)
    ```
    myJpProject/
    ├── sourceFolder/
    │   ├── JMdict_e
    │   └── JMnedict.xml
    └── destinationFolder/

    ```
1. Open `myJpProject` folder in terminal.

1. Run following commands

    ```sh
    npm install japanese-db-maker -g
    japanese-db-maker sqlite -s ./sourceFolder -d ./destinationFolder
    ```

## Authors

* **Ezzat Chamudi** - [ezhmd](https://github.com/ezhmd)

## Licenses

Japanese DB Maker code is released under [AGPL-3.0-only](https://spdx.org/licenses/AGPL-3.0-only.html). 

JMdict and JMnedict License http://www.edrdg.org/edrdg/licence.html.

Libraries, dependencies, and tools used in this project are tied with their own licenses respectively.

