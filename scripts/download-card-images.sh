#!/usr/bin/env bash
# Images sourced from metabismuth/tarot-json
# License: MIT — https://github.com/metabismuth/tarot-json/blob/master/LICENSE

set -euo pipefail

BASE_URL="https://raw.githubusercontent.com/metabismuth/tarot-json/master/images"
DEST="$(dirname "$0")/../src/assets/cards"

mkdir -p "$DEST"

download() {
  local filename="$1"
  local dest_file="$DEST/$filename"
  if [[ -f "$dest_file" ]]; then
    echo "skip  $filename"
    return
  fi
  echo "fetch $filename"
  curl -fsSL "$BASE_URL/$filename" -o "$dest_file"
}

# Major Arcana
download "m00.jpg"   # The Fool
download "m01.jpg"   # The Magician
download "m02.jpg"   # The High Priestess
download "m03.jpg"   # The Empress
download "m04.jpg"   # The Emperor
download "m05.jpg"   # The Hierophant
download "m06.jpg"   # The Lovers
download "m07.jpg"   # The Chariot
download "m08.jpg"   # Strength
download "m09.jpg"   # The Hermit
download "m10.jpg"   # Wheel of Fortune
download "m11.jpg"   # Justice
download "m12.jpg"   # The Hanged Man
download "m13.jpg"   # Death
download "m14.jpg"   # Temperance
download "m15.jpg"   # The Devil
download "m16.jpg"   # The Tower
download "m17.jpg"   # The Star
download "m18.jpg"   # The Moon
download "m19.jpg"   # The Sun
download "m20.jpg"   # Judgement
download "m21.jpg"   # The World

# Wands
download "w01.jpg"   # Ace of Wands
download "w02.jpg"   # Two of Wands
download "w03.jpg"   # Three of Wands
download "w04.jpg"   # Four of Wands
download "w05.jpg"   # Five of Wands
download "w06.jpg"   # Six of Wands
download "w07.jpg"   # Seven of Wands
download "w08.jpg"   # Eight of Wands
download "w09.jpg"   # Nine of Wands
download "w10.jpg"   # Ten of Wands
download "w11.jpg"   # Page of Wands
download "w12.jpg"   # Knight of Wands
download "w13.jpg"   # Queen of Wands
download "w14.jpg"   # King of Wands

# Cups
download "c01.jpg"   # Ace of Cups
download "c02.jpg"   # Two of Cups
download "c03.jpg"   # Three of Cups
download "c04.jpg"   # Four of Cups
download "c05.jpg"   # Five of Cups
download "c06.jpg"   # Six of Cups
download "c07.jpg"   # Seven of Cups
download "c08.jpg"   # Eight of Cups
download "c09.jpg"   # Nine of Cups
download "c10.jpg"   # Ten of Cups
download "c11.jpg"   # Page of Cups
download "c12.jpg"   # Knight of Cups
download "c13.jpg"   # Queen of Cups
download "c14.jpg"   # King of Cups

# Swords
download "s01.jpg"   # Ace of Swords
download "s02.jpg"   # Two of Swords
download "s03.jpg"   # Three of Swords
download "s04.jpg"   # Four of Swords
download "s05.jpg"   # Five of Swords
download "s06.jpg"   # Six of Swords
download "s07.jpg"   # Seven of Swords
download "s08.jpg"   # Eight of Swords
download "s09.jpg"   # Nine of Swords
download "s10.jpg"   # Ten of Swords
download "s11.jpg"   # Page of Swords
download "s12.jpg"   # Knight of Swords
download "s13.jpg"   # Queen of Swords
download "s14.jpg"   # King of Swords

# Pentacles
download "p01.jpg"   # Ace of Pentacles
download "p02.jpg"   # Two of Pentacles
download "p03.jpg"   # Three of Pentacles
download "p04.jpg"   # Four of Pentacles
download "p05.jpg"   # Five of Pentacles
download "p06.jpg"   # Six of Pentacles
download "p07.jpg"   # Seven of Pentacles
download "p08.jpg"   # Eight of Pentacles
download "p09.jpg"   # Nine of Pentacles
download "p10.jpg"   # Ten of Pentacles
download "p11.jpg"   # Page of Pentacles
download "p12.jpg"   # Knight of Pentacles
download "p13.jpg"   # Queen of Pentacles
download "p14.jpg"   # King of Pentacles

echo "Done. $(ls "$DEST" | wc -l) images in $DEST"
