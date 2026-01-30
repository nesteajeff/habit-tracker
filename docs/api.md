## API

### POST /habits

Create a new habit for the current user.

#### Request body

```
{
  "name": "Drink water",
  "description": "At least 8 cups"
}
```

#### Response (201)

```
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Drink water",
  "description": "At least 8 cups",
  "isActive": true,
  "createdAt": "2026-01-30T12:00:00.000Z"
}
```

#### Notes

- `userId` comes from auth, not the request body.
- `description` is optional.

### GET /habits

List habits for the current user.

#### Response (200)

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "name": "Drink water",
    "description": "At least 8 cups",
    "isActive": true,
    "createdAt": "2026-01-30T12:00:00.000Z"
  }
]
```
