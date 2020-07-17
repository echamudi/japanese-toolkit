# Planned folder structure for each package

| dir | description | ignore/include |
| - | - | - |
| /dist            | compiled code collection | [gitignore] [npminclude] |
| /dist/data       | compiled required data | [gitignore] [npminclude] |
| /dist/commonjs   | compiled commonjs | [gitignore] [npminclude] |
| /dist/umd        | compiled umd (web) | [gitignore] [npminclude] |
| /dist/es6        | compiled es6 module | [gitignore] [npminclude] |
| /dist/cli        | compiled cli codes | [gitignore] [npminclude] |
||||
| /src             | source codes collection that will be compiled to dist | [npminclude] |
| /src/gen         | generated codes | [gitignore] [npminclude] |
||||
| /lib             | codes that doesn't require compilation | [npminclude] |
| /lib/data        | required data (jsons, csvs, databases, etc) | [npminclude] |
| /lib/gen         | generated code | [gitignore] [npminclude] |
| /lib/cli         | cli codes | [npminclude]|
||||
| /scripts         | scripts for building the module and preparing the data | |
||||
| /temp/data       | pre processed data, usually generated from scripts | [gitignore] |
||||
| /test            | test scripts | |
| /test/temp       | temporary test results | [gitignore] |
| /test/fixtures   | test fixtures | |