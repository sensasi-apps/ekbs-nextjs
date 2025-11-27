# Survey Management - API Endpoints Documentation

## Backend Requirements

Halaman detail survey ini mengharapkan backend menyediakan endpoint berikut:

### 1. Get Survey Detail (with nested data)

```plain
GET /api/surveys/{id}
```

**Expected Response:**

```json
{
  "id": 1,
  "name": "Survey Kepuasan Pelanggan",
  "settings": null,
  "created_at": "2025-11-26T10:00:00Z",
  "updated_at": "2025-11-26T10:00:00Z",
  "sections": [
    {
      "id": 1,
      "survey_id": 1,
      "name": "Informasi Umum",
      "order": 0,
      "created_at": "2025-11-26T10:00:00Z",
      "updated_at": "2025-11-26T10:00:00Z",
      "questions": [
        {
          "id": 1,
          "survey_id": 1,
          "section_id": 1,
          "content": "Berapa umur Anda?",
          "type": "number",
          "options": null,
          "rules": null,
          "order": 0,
          "created_at": "2025-11-26T10:00:00Z",
          "updated_at": "2025-11-26T10:00:00Z"
        }
      ]
    }
  ]
}
```

### 1.1. Update Survey Name

```plain
PUT /api/surveys/{id}/update
```

**Request Body:**

```json
{
  "name": "Survey Kepuasan Pelanggan - Updated"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "name": "Survey Kepuasan Pelanggan - Updated",
  "settings": null,
  "created_at": "2025-11-26T10:00:00Z",
  "updated_at": "2025-11-27T10:00:00Z"
}
```

### 2. Section Management

#### Create Section

```plain
POST /api/surveys/sections
Body: {
  "survey_id": 1,
  "name": "Section Baru",
  "order": 0
}
```

#### Update Section

```plain
PUT /api/surveys/sections/{id}
Body: {
  "name": "Nama Section Updated"
}
```

#### Delete Section

```plain
DELETE /api/surveys/sections/{id}
```

#### Reorder Sections

```plain
PUT /api/surveys/{id}/sections/reorder
Body: {
  "sections": [
    { "id": 1, "order": 0 },
    { "id": 2, "order": 1 },
    { "id": 3, "order": 2 }
  ]
}
```

**Note:** Endpoint ini dipanggil saat user melakukan drag & drop untuk mengubah urutan sections.

### 3. Question Management

#### Create Question

```plain
POST /api/surveys/questions
Body: {
  "survey_id": 1,
  "section_id": 1,
  "content": "Pertanyaan Anda?",
  "type": "text",  // text|number|radio|multiselect
  "options": ["Option 1", "Option 2"],  // null untuk text/number, required untuk radio/multiselect
  "rules": null,
  "order": 0
}
```

#### Update Question

```plain
PUT /api/surveys/questions/{id}
Body: {
  "content": "Pertanyaan Updated?",
  "type": "radio",
  "options": ["A", "B", "C"]
}
```

#### Delete Question

```plain
DELETE /api/surveys/questions/{id}
```

#### Reorder Questions

```plain
PUT /api/surveys/sections/{sectionId}/questions/reorder
Body: {
  "questions": [
    { "id": 1, "order": 0 },
    { "id": 2, "order": 1 },
    { "id": 3, "order": 2 }
  ]
}
```

**Note:** Endpoint ini dipanggil saat user melakukan drag & drop untuk mengubah urutan questions dalam sebuah section.

## Question Types

- `text` - Accepting text answers
- `number` - Accepting numeric answers
- `radio` - Options presented as radio buttons, accepting 1 option for the answer (requires `options` array)
- `multiselect` - Options presented as checkboxes, accepting multiple options for the answer (requires `options` array)

## Database Schema Assumptions

### surveys

- id (PK)
- name
- settings (JSON, nullable)
- created_at
- updated_at

### sections

- id (PK)
- survey_id (FK)
- name
- order (integer for sorting)
- created_at
- updated_at

### questions

- id (PK)
- survey_id (FK)
- section_id (FK, nullable)
- content
- type (enum)
- options (JSON array, nullable)
- rules (JSON, nullable)
- order (integer for sorting)
- created_at
- updated_at

## Notes

- Sections dan questions di-sort berdasarkan field `order` (ascending)
- `order` field diperlukan untuk drag-drop reordering (sudah diimplementasikan untuk sections dan questions)
- Drag & drop menggunakan `@dnd-kit` library dengan optimistic UI update
- Endpoint reorder dipanggil setelah user selesai drag:
  - `/surveys/{id}/sections/reorder` untuk reorder sections
  - `/surveys/sections/{sectionId}/questions/reorder` untuk reorder questions dalam section
- Delete section akan cascade delete semua questions di dalamnya (handled by backend)
- Frontend menggunakan SWR untuk caching dan auto-revalidation
- Question types yang didukung: `text`, `number`, `radio`, `multiselect`
- `options` field hanya digunakan untuk type `radio` dan `multiselect`

---

## Summary Page - Rangkuman Jawaban

### Get Survey Summary (with entries and answers)

```plain
GET /api/surveys/{id}/summary
```

**Expected Response:**

```json
{
  "id": 1,
  "name": "Survey Kepuasan Pelanggan",
  "settings": null,
  "created_at": "2025-11-26T10:00:00Z",
  "updated_at": "2025-11-26T10:00:00Z",
  "sections": [
    {
      "id": 1,
      "survey_id": 1,
      "name": "Informasi Umum",
      "order": 0,
      "created_at": "2025-11-26T10:00:00Z",
      "updated_at": "2025-11-26T10:00:00Z",
      "questions": [
        {
          "id": 1,
          "survey_id": 1,
          "section_id": 1,
          "content": "Berapa umur Anda?",
          "type": "number",
          "options": null,
          "rules": null,
          "order": 0,
          "created_at": "2025-11-26T10:00:00Z",
          "updated_at": "2025-11-26T10:00:00Z"
        }
      ]
    }
  ],
  "entries": [
    {
      "id": 1,
      "survey_id": 1,
      "participant_id": 123,
      "created_at": "2025-11-27T08:00:00Z",
      "updated_at": "2025-11-27T08:00:00Z",
      "participant": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "answers": [
        {
          "id": "abc-123",
          "question_id": 1,
          "entry_id": 1,
          "text": "25",
          "created_at": "2025-11-27T08:00:00Z",
          "updated_at": "2025-11-27T08:00:00Z",
          "question": {
            "id": 1,
            "content": "Berapa umur Anda?",
            "type": "number"
          }
        }
      ]
    }
  ]
}
```

**Notes:**

- Response sama dengan GET `/api/surveys/{id}` tapi ditambahkan field `entries` dengan nested `answers`
- `entries` berisi semua submission survey dengan jawaban masing-masing participant
- `participant` field optional (bisa null untuk anonymous surveys)
- Untuk question type `multiselect`, `text` field berisi comma-separated values (contoh: "Pilihan A,Pilihan C")
- Frontend akan mengagregasi data untuk menampilkan statistik dan rangkuman

---

## Entries Page - Daftar Entri Survey

### Get Survey Entries (with answers)

```plain
GET /api/surveys/{id}/entries
```

**Expected Response:**

```json
{
  "id": 1,
  "name": "Survey Kepuasan Pelanggan",
  "settings": null,
  "created_at": "2025-11-26T10:00:00Z",
  "updated_at": "2025-11-26T10:00:00Z",
  "sections": [
    {
      "id": 1,
      "survey_id": 1,
      "name": "Informasi Umum",
      "order": 0,
      "created_at": "2025-11-26T10:00:00Z",
      "updated_at": "2025-11-26T10:00:00Z",
      "questions": [
        {
          "id": 1,
          "survey_id": 1,
          "section_id": 1,
          "content": "Berapa umur Anda?",
          "type": "number",
          "options": null,
          "rules": null,
          "order": 0,
          "created_at": "2025-11-26T10:00:00Z",
          "updated_at": "2025-11-26T10:00:00Z"
        }
      ]
    }
  ],
  "entries": [
    {
      "id": 1,
      "survey_id": 1,
      "participant_id": 123,
      "created_at": "2025-11-27T08:00:00Z",
      "updated_at": "2025-11-27T08:00:00Z",
      "participant": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "answers": [
        {
          "id": "abc-123",
          "question_id": 1,
          "entry_id": 1,
          "text": "25",
          "created_at": "2025-11-27T08:00:00Z",
          "updated_at": "2025-11-27T08:00:00Z",
          "question": {
            "id": 1,
            "content": "Berapa umur Anda?",
            "type": "number"
          }
        }
      ]
    }
  ]
}
```

**Notes:**

- Response sama dengan GET `/api/surveys/{id}/summary` (untuk konsistensi)
- `entries` berisi semua submission survey dengan nested `answers`
- Setiap entry menampilkan semua jawaban untuk semua pertanyaan survey
- `participant` field optional (bisa null untuk anonymous surveys)
- Frontend menampilkan entries dalam format card dengan tabel jawaban
