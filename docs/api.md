## API

All requests require an `x-user-id` header for now (demo auth).

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
    "hasCheckedInToday": false,
    "lastEntryDate": "2026-01-30",
    "createdAt": "2026-01-30T12:00:00.000Z"
  }
]
```

### POST /habits/:id/check-in

Create a check-in for a habit on a specific date (defaults to today).

#### Request body (optional)

```
{
  "entryDate": "2026-01-30"
}
```

#### Response (201)

```
{
  "id": "uuid",
  "habitId": "uuid",
  "entryDate": "2026-01-30",
  "createdAt": "2026-01-30T12:00:00.000Z"
}
```

#### Notes

- If `entryDate` is omitted, the server uses today (UTC).
- One entry per habit per day (unique constraint).

### GET /habits/:id/entries

List check-ins for a habit.

#### Response (200)

```
[
  {
    "id": "uuid",
    "habitId": "uuid",
    "entryDate": "2026-01-30",
    "createdAt": "2026-01-30T12:00:00.000Z"
  }
]
```

### GET /habits/:id/streak

Get the current streak for a habit.

#### Response (200)

```
{
  "habitId": "uuid",
  "currentStreak": 3
}
```

#### Notes

- Streak counts consecutive days ending today (UTC).

### GET /goals

List goals for the current user.

#### Response (200)

```
[
  {
    "id": "uuid",
    "userId": "uuid",
    "title": "Run a 5k",
    "targetDate": "2026-02-15",
    "status": "active",
    "createdAt": "2026-01-30T12:00:00.000Z"
  }
]
```

### POST /goals

Create a new goal for the current user.

#### Request body

```
{
  "title": "Run a 5k",
  "targetDate": "2026-02-15"
}
```

#### Response (201)

```
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Run a 5k",
  "targetDate": "2026-02-15",
  "status": "active",
  "createdAt": "2026-01-30T12:00:00.000Z"
}
```

### PATCH /goals/:id

Update a goal's status.

#### Request body

```
{
  "status": "paused"
}
```

#### Response (200)

```
{
  "id": "uuid",
  "userId": "uuid",
  "title": "Run a 5k",
  "targetDate": "2026-02-15",
  "status": "paused",
  "createdAt": "2026-01-30T12:00:00.000Z"
}
```
