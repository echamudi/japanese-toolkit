# Folder Structure for Each Package

| dir | description | ignore/include |
| - | - | - |
| /dist            | compiled things from **src** or **scripts** | gitignore npminclude |
| /dist/data       | data (jsons, csvs, databases, etc)  | gitignore npminclude |
| /dist/commonjs   | commonjs | gitignore npminclude |
| /dist/umd        | umd (web) | gitignore npminclude |
| /dist/es6        | es6 module | gitignore npminclude |
| /dist/bin        | cli codes | gitignore npminclude |
||||
| /src             | things that will be compiled to **dist** | npminclude |
| /src/gen         | generated codes | gitignore npminclude |
||||
| /lib             | things that don't need to be compiled | npminclude |
| /lib/gen         | generated code | gitignore npminclude |
| /lib/data        | required data (jsons, csvs, databases, etc) | npminclude |
| /lib/bin         | cli codes | npminclude |
||||
| /scripts         | scripts for building the module and preparing the data | |
||||
| /temp/data       | pre processed data, usually generated from scripts | gitignore |
||||
| /test            | test scripts | |
| /test/temp       | temporary test results | gitignore |
| /test/fixtures   | test fixtures | |