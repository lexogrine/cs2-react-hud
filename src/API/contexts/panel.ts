export const panelDefinition = [
  {
    "label": "Trivia",
    "name": "trivia",
    "inputs": [
      {
        "type": "text",
        "name": "title",
        "label": "Trivia title"
      },
      {
        "type": "text",
        "name": "content",
        "label": "Trivia content"
      },
      {
        "type": "action",
        "name": "triviaState",
        "values": [
          {
            "name": "show",
            "label": "Show trivia"
          },
          {
            "name": "hide",
            "label": "Hide trivia"
          }
        ]
      }
    ]
  },
  {
    "label": "Display settings",
    "name": "display_settings",
    "inputs": [
      {
        "type": "text",
        "name": "left_title",
        "label": "Left box's title"
      },
      {
        "type": "text",
        "name": "right_title",
        "label": "Right box's title"
      },
      {
        "type": "text",
        "name": "left_subtitle",
        "label": "Left box's subtitle"
      },
      {
        "type": "text",
        "name": "right_subtitle",
        "label": "Right box's subtitle"
      },
      {
        "type": "image",
        "name": "left_image",
        "label": "Left box's image logo"
      },
      {
        "type": "image",
        "name": "right_image",
        "label": "Right box's image logo"
      },
      {
        "type": "select",
        "name": "replace_avatars",
        "label": "Use team logos as player avatars",
        "values": [
          {
            "label": "Only if player has no avatar",
            "name": "if_missing"
          },
          {
            "label": "Always",
            "name": "always"
          }
        ]
      },
      {
        "type": "action",
        "name": "boxesState",
        "values": [
          {
            "name": "show",
            "label": "Show boxes"
          },
          {
            "name": "hide",
            "label": "Hide boxes"
          }
        ]
      },
      {
        "type": "action",
        "name": "toggleRadarView",
        "values": [
          {
            "name": "toggler",
            "label": "Toggle radar view"
          }
        ]
      }
    ]
  },
  {
    "label": "Player & Match overview",
    "name": "preview_settings",
    "inputs": [
      {
        "type": "match",
        "name": "match_preview",
        "label": "Pick an upcoming match"
      },
      {
        "type": "select",
        "name": "select_preview",
        "label": "Mood indicator",
        "values": [
          {
            "name": "show",
            "label": ":)"
          },
          {
            "name": "hide",
            "label": ":("
          }
        ]
      },
      {
        "type": "player",
        "name": "player_preview",
        "label": "Pick a player to preview"
      },
      {
        "type": "checkbox",
        "name": "player_preview_toggle",
        "label": "Show player preview"
      },
      {
        "type": "checkbox",
        "name": "match_preview_toggle",
        "label": "Show upcoming match"
      },
      {
        "type": "action",
        "name": "showTournament",
        "values": [
          {
            "name": "show",
            "label": "Show tournament"
          },
          {
            "name": "hide",
            "label": "Hide tournament"
          }
        ]
      }
    ]
  }
] as const;