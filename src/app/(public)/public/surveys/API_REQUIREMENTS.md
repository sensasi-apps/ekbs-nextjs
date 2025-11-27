# API Requirements for Public Survey Pages

## Backend Requirements

Halaman detail survey ini mengharapkan backend menyediakan endpoint berikut:

## Public Survey Pages - Halaman Publik untuk Responden

### Get Public Survey (for filling)

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

**Notes:**

- Endpoint sama dengan yang digunakan admin tapi untuk public access
- Tidak memerlukan autentikasi
- Response tidak menyertakan `entries` (hanya struktur survey)
- Digunakan untuk halaman publik pengisian survey

### Submit Survey Answers

```plain
POST /api/surveys/{id}/submit
```

**Request Body:**

```json
{
  "answers": [
    {
      "question_id": 1,
      "text": "25"
    },
    {
      "question_id": 2,
      "text": "Jakarta,Pilihan B"
    }
  ]
}
```

**Expected Response:**

```json
{
  "message": "Survey submitted successfully",
  "entry_id": 123
}
```

**Notes:**

- `answers` array berisi jawaban untuk setiap pertanyaan
- Untuk question type `multiselect`, `text` berisi comma-separated values
- Tidak memerlukan autentikasi (anonymous submission)
- Setelah submit berhasil, redirect ke halaman thank-you
- Backend harus membuat EntryORM baru dengan answers
