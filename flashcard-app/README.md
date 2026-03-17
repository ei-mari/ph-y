# Flashcard App

`index.html` をブラウザで開くと使えます。

## Deck format

JSON は次の形で読み込めます。

```json
{
  "name": "Deck name",
  "cards": [
    {
      "id": "01",
      "image": "../pre_definition_images_all/01_drop_by.jpg",
      "audio": "../requested_50_example_audio/01_feel_free_to_drop_by_my_place_anytim.m4a",
      "frontText": "Feel free to ____ my place anytime!",
      "answer": "drop by",
      "backText": "drop by"
    }
  ]
}
```

## Current behavior

- Front: image + fill-in-the-blank text
- Back: answer + audio playback
- Click card: flip to back
- Click back or `Play Audio`: play audio
- `Space`: flip or play
- `Left/Right`: previous/next card
