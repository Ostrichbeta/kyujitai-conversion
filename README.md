# Kyūjitai Converter
A script to convert the Kanjis to the old form in Japanese pages.

## How to use
- Install the script from Greasy Fork.
- It's done! There are no config for this script. The script will be automatically loaded to your browser.

## FAQ
### The script doesn't work on XXX site!
There are several conditions:
- The website's language setting is not in Japanese (Open the DevTools, check the first html tag in the source, it should have ```lang="ja"``` or ```lang="ja-JP```, otherwise the script wil abort the conversion)
- Cannot get the conversions on the [database](https://github.com/Ostrichbeta/kyujitai-conversion/blob/main/convert.csv)

### There are conversion mistakes!
Due to the conversions, some Kyujitai Kanjis were mapped to one single Shinjitai Kanji (especally the Kanji 弁). Thus, 弁財 can be 辨財, 辨才, 辯財, 辯才, etc.. So there are always mistakes in the conversion.
> If you have better conversions, pull a PR to the database or the script.