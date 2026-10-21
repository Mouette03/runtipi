# Update notices (`update_notices`)

App maintainers can declare warnings in an app's `config.json` that Runtipi displays as the **first step of the update wizard**, before the configuration and backup steps. They are typically used to flag breaking changes, required preparations and post-update steps.

Invalid notices invalidate the whole `config.json`, exactly like any other schema error: the app is hidden from the store.

## Example (English reference + French translation)

```json
{
  "id": "my-app",
  "name": "My App",
  "version": "5.2.0",
  "tipi_version": 25,
  "update_notices": [
    {
      "id": "database-migration-22",
      "tipi_version": 22,
      "severity": "warning",
      "title": "Database migration",
      "message": "The database format changes with this update. The first startup may take several minutes.",
      "before_update": [
        "Make sure you have enough free disk space.",
        "Plan a backup before starting the update."
      ],
      "after_update": [
        "Do not restart the app while the migration is running.",
        "Check the logs and sign in to verify the data."
      ],
      "require_confirmation": true,
      "translations": {
        "fr": {
          "title": "Migration de la base de données",
          "message": "Le format de la base change avec cette mise à jour. Le premier démarrage peut prendre plusieurs minutes.",
          "before_update": [
            "Vérifiez l'espace disque disponible.",
            "Prévoyez une sauvegarde avant de lancer la mise à jour."
          ],
          "after_update": [
            "Ne redémarrez pas l'application pendant la migration.",
            "Vérifiez les journaux puis connectez-vous pour contrôler les données."
          ]
        }
      }
    }
  ]
}
```

## Fields

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `id` | yes | — | Unique notice id within the app. |
| `tipi_version` | yes | — | Package revision that introduces the change. |
| `severity` | no | `"warning"` | `"info"` or `"warning"` (visual only). |
| `title` | yes | — | Short title shown in the wizard. |
| `message` | yes | — | Explanation of the change. |
| `before_update` | no | `[]` | Steps to take before updating. |
| `after_update` | no | `[]` | Steps to take after updating. |
| `require_confirmation` | no | `true` | Requires the user to acknowledge the notice before continuing. |
| `translations` | no | — | Per-locale overrides (e.g. `fr`, `fr-FR`); any omitted field falls back to the English reference. |

## Rules

- A notice applies when: `installed tipi_version < notice tipi_version <= target tipi_version`. Notices for already-installed revisions are never shown again, and they reappear on every retry of a failed update (acknowledgements are never persisted).
- Keep older notices in the list so users jumping several revisions see them. A notice revision cannot exceed the package `tipi_version`, and ids must be unique — otherwise the config is invalid.
- Apps with confirmation-required notices are excluded from "update all" and must be updated individually.
- The notices are informational: they never execute commands or modify files.

---

# Avertissements de mise à jour (`update_notices`)

Les mainteneurs peuvent déclarer des avertissements dans le `config.json` d'une application. Runtipi les affiche en **première étape de l'assistant de mise à jour**, avant les étapes de configuration et de sauvegarde. Ils servent généralement à signaler des changements majeurs, les préparatifs nécessaires et les étapes à suivre après la mise à jour.

Un avertissement invalide invalide le `config.json` entier, comme toute autre erreur de schéma : l'application n'apparaît plus dans le store.

L'exemple ci-dessus montre la version anglaise de référence accompagnée d'une traduction française (`translations.fr`). Tout champ omis dans une traduction retombe sur la valeur anglaise.

## Règles

- Un avertissement s'applique quand : `tipi_version installée < tipi_version de l'avertissement <= tipi_version cible`. Les avertissements des révisions déjà installées ne s'affichent plus, et ils réapparaissent à chaque nouvelle tentative après un échec (les confirmations ne sont jamais conservées).
- Conservez les anciens avertissements dans la liste afin que les utilisateurs qui sautent plusieurs versions les voient. La révision d'un avertissement ne peut pas dépasser le `tipi_version` du paquet et les identifiants doivent être uniques, sinon la configuration est invalide.
- Les applications avec avertissements à confirmation obligatoire sont exclues de « Tout mettre à jour » et doivent être mises à jour individuellement.
- Les avertissements sont informatifs : ils n'exécutent aucune commande et ne modifient aucun fichier.
