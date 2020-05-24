# Furigana

[⏳Work in Progress] Furigana toolkit for Japanese sentences

## Features Plan

- Generate readings

     This module will be able to generate all posssible readings from a string.

     Example:

     ```
     readings(根本)
          := 根[ね] 本[もと]
          |  根[こん] 本[ぽん]
     ```

- Fit hiragana string into a kanji string

     Examples:

     ```
     fit ('商売を行って', 'しょぷばいをおこなって')
          := 商[しょう] 売[ばい] を行[おこな] って

     fit ('学校に行って', 'がっこうにいって')
          := 学[がっ] 校[こう] に行[い] って
     ```
## License

Copyright © 2020 Ezzat Chamudi

MPL-2.0
