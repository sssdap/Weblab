# Firestore Indexes Setup Guide

## Overview

The WebLab application requires composite indexes for queries that filter by `published` status and order by `order` field. This document provides instructions on how to create these indexes.

## Required Indexes

### 1. Courses Collection Index

**Collection Path:** `courses`

**Index Configuration:**
- Field: `published` (Ascending)
- Field: `order` (Ascending)

**Query Pattern:**
```javascript
query(
  collection(db, "courses"),
  where("published", "==", true),
  orderBy("order", "asc")
)
```

**Firebase Console Link:**
Follow the error message link provided in the Firebase console error, or manually create the index as follows:

**Manual Creation Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (weblab-v0)
3. Navigate to **Firestore Database** > **Indexes** > **Composite Indexes**
4. Click **Create Index**
5. Fill in:
   - Collection ID: `courses`
   - First field: `published` (Ascending)
   - Second field: `order` (Ascending)
6. Click **Create Index**

---

### 2. Chapters Sub-collection Index

**Collection Path:** `courses/{courseId}/chapters`

**Index Configuration:**
- Field: `published` (Ascending)
- Field: `order` (Ascending)

**Query Pattern:**
```javascript
query(
  collection(db, "courses", courseId, "chapters"),
  where("published", "==", true),
  orderBy("order", "asc")
)
```

**Manual Creation Steps:**
1. Go to **Firestore Database** > **Indexes** > **Composite Indexes**
2. Click **Create Index**
3. Fill in:
   - Collection ID: `courses` / `chapters` (select the chapters subcollection)
   - First field: `published` (Ascending)
   - Second field: `order` (Ascending)
4. Click **Create Index**

---

### 3. Lessons Sub-collection Index

**Collection Path:** `courses/{courseId}/chapters/{chapterId}/lessons`

**Index Configuration:**
- Field: `published` (Ascending)
- Field: `order` (Ascending)

**Query Pattern:**
```javascript
query(
  collection(db, "courses", courseId, "chapters", chapterId, "lessons"),
  where("published", "==", true),
  orderBy("order", "asc")
)
```

**Manual Creation Steps:**
1. Go to **Firestore Database** > **Indexes** > **Composite Indexes**
2. Click **Create Index**
3. Fill in:
   - Collection ID: `courses` / `chapters` / `lessons` (select the lessons subcollection)
   - First field: `published` (Ascending)
   - Second field: `order` (Ascending)
4. Click **Create Index**

---

## Automation via Firebase CLI

You can also create indexes programmatically using the Firebase CLI. Create a `firestore.indexes.json` file:

```json
{
  "indexes": [
    {
      "collectionGroup": "courses",
      "queryScope": "Collection",
      "fields": [
        {
          "fieldPath": "published",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "chapters",
      "queryScope": "Collection",
      "fields": [
        {
          "fieldPath": "published",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "lessons",
      "queryScope": "Collection",
      "fields": [
        {
          "fieldPath": "published",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "order",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy:
```bash
firebase deploy --only firestore:indexes
```

---

## Verification

After creating the indexes, they will appear in the Firebase Console with a status of "Enabled". The status transitions are:

1. **Creating** - Index is being built
2. **Enabled** - Index is ready for queries (this can take a few minutes to hours depending on data size)

Once all three indexes are **Enabled**, the queries in the student course service will work without errors.

---

## Troubleshooting

### Still Getting Index Errors?

1. **Wait for index creation**: Large datasets can take time (up to 24 hours)
2. **Check collection names**: Ensure collection paths match exactly
3. **Verify field names**: Double-check field names are `published` and `order`
4. **Test in Firestore Console**: Try running the query directly in the Firestore Console's query builder to verify the index exists

### How to Check Existing Indexes

1. Go to Firebase Console
2. Navigate to **Firestore Database** > **Indexes** > **Composite Indexes**
3. Look for indexes with `published` and `order` fields

---

## Related Files

- `services/student-course.service.ts` - Contains the queries that require these indexes
- `app/(authenticated)/(student)/course/page.tsx` - Uses getPublishedCourses()
- `app/(authenticated)/(student)/course/[moduleId]/page.tsx` - Uses getPublishedChapters()
- `app/(authenticated)/(student)/course/[moduleId]/chapters/[chapterId]/page.tsx` - Uses getPublishedLessons()
- `app/(authenticated)/(student)/chapter/[lessonId]/page.tsx` - Uses getPublishedLesson()

