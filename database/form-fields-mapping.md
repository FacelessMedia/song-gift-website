# SongGift Form Fields - Complete Supabase Storage Mapping

## 📊 STORAGE STRATEGY

**All form inputs are stored in TWO ways:**

1. **Complete Data**: `intake_payload` JSONB field (contains ALL 20+ fields)
2. **Key Fields**: Individual columns for easy querying and reporting

## 🗂️ COMPLETE FORM FIELDS MAPPING

### **Step 1: Who is this song meant to move?**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Recipient Relationship | `recipient_relationship` | TEXT | ✅ |
| Custom Relationship | - | - | ✅ (recipientCustomRelation) |
| Recipient Name | `recipient_name` | TEXT | ✅ |
| Name Pronunciation | - | - | ✅ (recipientNamePronunciation) |
| Song Perspective | `song_perspective` | TEXT | ✅ |
| Custom Perspective | - | - | ✅ (songPerspectiveCustom) |

### **Step 2: What language should their heart hear this in?**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Primary Language | `primary_language` | TEXT | ✅ |
| Language Style | - | - | ✅ (languageStyle) |
| Secondary Language | - | - | ✅ (secondaryLanguage) |
| Language Specific Phrases | - | - | ✅ (languageSpecificPhrases) |

### **Step 3: How should this song feel when it plays?**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Music Style | `music_style` | TEXT[] | ✅ (array) |
| Emotional Vibe | `emotional_vibe` | TEXT[] | ✅ (array) |
| Voice Preference | `voice_preference` | TEXT | ✅ |
| Music Inspiration Notes | - | - | ✅ (musicInspirationNotes) |

### **Step 4: What makes them unforgettable to you?**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Recipient Qualities | - | - | ✅ (recipientQualities) |
| Shared Memories | - | - | ✅ (sharedMemories) |
| Faith Expression Level | `faith_expression_level` | TEXT | ✅ |

### **Step 5: If this song could say one thing for you...**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Core Message | `core_message` | TEXT | ✅ |
| AI Rephrasing Permission | - | - | ✅ (aiRephrasingPermission) |
| Intake Completed At | - | - | ✅ (intakeCompletedAt) |

### **Step 6: Contact Information**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Full Name | `customer_name` | TEXT | ✅ (fullName) |
| Email Address | `customer_email` | TEXT | ✅ (email) |
| Phone Number | `customer_phone` | TEXT | ✅ (phoneNumber) |

### **Checkout Options**
| Form Field | Supabase Column | Supabase Type | Also in intake_payload |
|------------|-----------------|---------------|------------------------|
| Express Delivery | `delivery_speed` | TEXT | ✅ (expressDelivery) |

## 🔍 QUERYING EXAMPLES

### **Easy Queries (Individual Columns)**
```sql
-- Find all songs for wives
SELECT * FROM orders WHERE recipient_relationship = 'wife';

-- Find all acoustic songs
SELECT * FROM orders WHERE 'acoustic' = ANY(music_style);

-- Find all romantic songs
SELECT * FROM orders WHERE 'romantic' = ANY(emotional_vibe);

-- Find orders by customer name
SELECT * FROM orders WHERE customer_name ILIKE '%john%';
```

### **Complex Queries (JSONB Field)**
```sql
-- Find orders with specific language style
SELECT * FROM orders 
WHERE intake_payload->>'languageStyle' = 'bilingual-blend';

-- Find orders with custom relationships
SELECT * FROM orders 
WHERE intake_payload->>'recipientCustomRelation' != '';

-- Find orders with AI rephrasing permission
SELECT * FROM orders 
WHERE (intake_payload->>'aiRephrasingPermission')::boolean = true;
```

## ✅ VERIFICATION CHECKLIST

After running the migration, verify:

- ✅ **All 20+ fields** stored in `intake_payload` JSONB
- ✅ **9 key fields** extracted to individual columns
- ✅ **Customer contact** fields (name, email, phone) in separate columns
- ✅ **Array fields** (music_style, emotional_vibe) properly indexed
- ✅ **Session ID** tracking for user journey analysis

## 🎯 BENEFITS

**Individual Columns:**
- Fast queries and filtering
- Easy reporting and analytics
- Database indexes for performance
- Simple SQL queries

**JSONB Field:**
- Complete form data preservation
- Flexible schema for future fields
- Complex nested queries
- Full audit trail

**Both approaches ensure NO form data is lost and ALL inputs are accessible in Supabase.**
