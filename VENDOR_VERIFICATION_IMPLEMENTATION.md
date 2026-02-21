# Vendor Verification Implementation Guide

## Overview

This is a clean, modular implementation of the vendor account verification system for the Atlaze dashboard. It allows vendors to submit required and optional documentation (passports, IDs, addresses, etc.) to complete their account verification.

## Architecture

The implementation follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│       Page Layer (verification/page.tsx)                    │
│       - Fetches verification methods                        │
│       - Handles loading/error states                        │
│       - Renders sections (required vs optional)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│       Component Layer (VerificationItem.tsx)                │
│       - Manages individual verification submission          │
│       - Handles file upload & drag-drop                     │
│       - Manages UI state transitions                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│       Service Layer (lib/actions/dashboard/verification.ts) │
│       - Server actions for API communication                │
│       - Handles FormData for file uploads                   │
│       - Manages authentication (JWT token)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│       Types Layer (types/verification.types.ts)             │
│       - TypeScript interfaces for type safety               │
│       - API request/response shapes                         │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
types/
└── verification.types.ts              # Type definitions

lib/
└── actions/
    └── dashboard/
        └── verification.ts            # Server actions for API calls

components/
└── dashboard/
    └── settings/
        └── VerificationItem.tsx       # Reusable verification component

app/
└── dashboard/
    └── settings/
        └── verification/
            └── page.tsx               # Main verification page
```

## Key Features

### 1. **Smart UI State Management**
The `VerificationItem` component implements a two-state UI pattern:

**State 1: Idle (Initial)**
```
┌─────────────────────────────────────┐
│ Method Title                        │
│ Help text describing what's needed  │
│             [Start Verification]    │
└─────────────────────────────────────┘
```

**State 2: Expanded (Upload)**
```
┌─────────────────────────────────────┐
│ Method Title                        │
│ Help text describing what's needed  │
│                                     │
│  [Drag & Drop Zone]                │
│                                     │
│ Selected Files List:                │
│  - file1.pdf (2.5 MB) [X]          │
│  - file2.jpg (1.3 MB) [X]          │
│                                     │
│              [Cancel]  [Submit]     │
└─────────────────────────────────────┘
```

### 2. **Robust File Handling**
- **Drag & drop support** - Users can drag files directly onto the upload area
- **Multiple file selection** - Upload multiple documents at once
- **File validation**:
  - Max 5MB per file
  - Allowed types: Images (JPEG, PNG, GIF), PDF, Word documents
  - Clear error messages for validation failures
- **Visual feedback** - Shows file list with size information and removal options

### 3. **API Integration**
Uses FormData for multipart file uploads, matching WordPress/Dokan specifications:

```typescript
POST /wp-json/dokan/v1/vendor-verification
Headers:
  Authorization: Bearer {wpToken}
Body: multipart/form-data
  verification_id: 1
  files[]: File[]
```

### 4. **Error Handling**
- **Network errors** - Clear error messages with retry option
- **Validation errors** - File size, type validation with user-friendly messages
- **API errors** - Handles non-200 responses gracefully
- **Loading states** - Prevents duplicate submissions during processing

### 5. **Types of Verification Methods**

#### Custom (ID, Passport, License)
- Accepts images, PDFs
- Help text guides users on what documents are needed
- No special configuration

#### Address
- Requires document with address
- Same file types as custom
- May include `seller_address` field showing current address

#### Phone
- Handled separately via SMS gateway
- Configuration status: `is_configured`, `active_gateway`
- Not part of file upload flow

#### Social
- Social profile linking
- Configured separately
- Not part of this implementation

## How It Works

### User Flow

1. **Landing on Verification Page**
   - Page fetches available verification methods from API
   - Methods are split into "Required" and "Optional" sections
   - Each method shows as a card with "Start Verification" button

2. **Starting Verification**
   - User clicks "Start Verification" button
   - Card expands to show upload interface
   - File input zone appears with drag-drop support

3. **Uploading Files**
   - User can drag files or click to browse
   - Files are added to a visual list
   - User can remove individual files before submission
   - Validation ensures files meet requirements

4. **Submission**
   - User clicks "Submit" button
   - Files are sent as FormData with verification_id
   - Loading state shows upload progress
   - Success confirmation appears
   - Page auto-refreshes verification status

5. **Completion**
   - Success message displayed
   - Card shows checkmark indicator
   - User can start next verification method

### Server Action Flow (verification.ts)

```
getVendorVerificationMethods()
├─ Get session & JWT token
├─ Fetch from /wp-json/dokan/v1/vendor-verification
├─ Return typed response
└─ Handle errors gracefully

submitVerification(verificationId, files)
├─ Get session & JWT token
├─ Build FormData with files
├─ POST to /wp-json/dokan/v1/vendor-verification
├─ Handle response/errors
└─ Return success/failure result

getVerificationStatus(verificationId)
├─ Get session & JWT token
├─ Fetch individual verification status
├─ Return status data
└─ Handle not found gracefully
```

## Code Quality Features

### 1. **DRY Principle**
- Reusable `VerificationItem` component eliminates copy-paste
- Shared file validation logic
- Common error handling patterns

### 2. **TypeScript Safety**
- Fully typed interfaces for API responses
- Type-safe server actions
- Prevents runtime errors

### 3. **Performance**
- Lazy loading of verification methods
- Efficient state management
- No unnecessary re-renders
- Memoized callbacks (useCallback)

### 4. **Accessibility**
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Clear error messages
- Loading state indicators

### 5. **Testing Considerations**
- Pure components with props
- Side effects isolated in hooks
- Server actions are testable
- Clear error boundaries

## Configuration

### File Size Limits
Currently set to 5MB per file (adjustable in `VerificationItem.tsx`):
```typescript
if (file.size > 5 * 1024 * 1024) {
  setError(`File is too large...`);
}
```

### Accepted File Types
```typescript
const allowedTypes = [
  "image/jpeg",      // .jpg, .jpeg
  "image/png",       // .png
  "image/gif",       // .gif
  "application/pdf", // .pdf
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
];
```

### API Endpoints
All endpoints configured in `verification.ts`:
- **GET**: `/wp-json/dokan/v1/vendor-verification?_locale=user`
- **POST**: `/wp-json/dokan/v1/vendor-verification`
- **GET**: `/wp-json/dokan/v1/vendor-verification/{id}`

## Error Scenarios & Handling

| Scenario | Handling |
|----------|----------|
| No session/token | Error message + Retry button |
| Network failure | User-friendly error + Retry |
| File too large | Validation error before upload |
| Invalid file type | Validation error before upload |
| API returns 400 | Show API error message |
| API returns 500 | Generic error + Retry button |
| No files selected | Submit button disabled |
| Upload interrupted | Show error state + ability to retry |

## Real API Response Example

The implementation expects this response structure:

```json
{
  "verification_methods": [
    {
      "id": 1,
      "title": "Passport",
      "help_text": "Upload a scanned copy or photo of your valid passport.",
      "status": true,
      "required": false,
      "kind": "custom",
      "created_at": "28/10/2025 4:09 am",
      "updated_at": "28/10/2025 4:09 am"
    },
    {
      "id": 4,
      "title": "Address",
      "help_text": "Upload a document file with your address...",
      "status": true,
      "required": true,
      "kind": "address",
      "created_at": "28/10/2025 4:09 am",
      "updated_at": "28/10/2025 4:09 am",
      "seller_address": "Bayelsa"
    }
  ],
  "social_providers": [],
  "phone_verification": {
    "is_configured": false,
    "active_gateway": "",
    "phone_status": "",
    "phone_no": ""
  }
}
```

## Implementation Details

### Why No Images Assumption?
The implementation correctly handles **ANY file type**, not just images, because:

1. **"Address" verification** typically requires PDFs or Word documents
2. **"Passport/ID" verification** might need high-quality PDFs or scans
3. **Dokan API doesn't specify** file type - it accepts multipart FormData
4. The `help_text` guides users on what to upload
5. File validation is flexible based on actual content type

### Why FormData?
- WordPress Media Library expects multipart/form-data
- Allows multiple files in single request
- Only method for file uploads in Next.js (can't use JSON with files)
- Matches existing patterns in codebase (MediaUpload component)

### Why Server Actions?
- Access to JWT token (sensitive data)
- Environment variables for API URL
- No CORS issues (server-to-server communication)
- Natural fit with Next.js 13+ App Router

## Testing the Implementation

### Manual Testing Checklist
- [ ] Page loads and fetches verification methods
- [ ] Methods split correctly into required/optional
- [ ] Click "Start Verification" expands the card
- [ ] Drag & drop files works
- [ ] Can select files via file picker
- [ ] File validation works (size, type)
- [ ] Can remove files from list
- [ ] Submit button disabled until files selected
- [ ] Submit sends files to API correctly
- [ ] Error messages display properly
- [ ] Success message shows after submission
- [ ] Refresh button works
- [ ] Loading states display correctly

### Browser DevTools Testing
- Open Network tab
- Check POST request to `/wp-json/dokan/v1/vendor-verification`
- Verify FormData includes `verification_id` and `files[]`
- Verify Authorization header is present

## Future Enhancements

1. **Status Tracking**
   - Show verification status (pending/approved/rejected)
   - Display reason for rejection with resubmit option

2. **Progress Indicators**
   - Show completion percentage
   - Display which verifications are completed

3. **Batch Operations**
   - Submit all verification documents at once
   - Bulk status check

4. **File Preview**
   - Preview images before submission
   - Show PDF thumbnails

5. **Analytics**
   - Track verification completion rates
   - Log submission attempts

## Troubleshooting

### Files Not Uploading
1. Check browser console for errors
2. Verify JWT token is present in session
3. Check Network tab for API responses
4. Ensure files meet size/type requirements

### Page Shows "No Verification Methods"
1. Verify API endpoint is accessible
2. Check if vendor account has permissions
3. Look at server logs for API errors

### Form Stays in Loading State
1. Check Network tab - is request hanging?
2. Verify server has responded
3. Check browser console for JavaScript errors
4. Try refresh button

## Best Practices Used

✅ **Clean Code**
- Descriptive variable names
- Comments for non-obvious logic
- Consistent code style

✅ **Security**
- Server actions for sensitive operations
- JWT token management
- Input validation
- Error messages don't leak internal details

✅ **Performance**
- No unnecessary API calls
- Efficient event handling
- Proper cleanup in useEffect
- Memoized callbacks

✅ **User Experience**
- Clear loading states
- Descriptive error messages
- Visual feedback for all actions
- Logical grouping of required/optional

✅ **Maintainability**
- Modular component structure
- Type safety throughout
- Reusable patterns
- Clear separation of concerns

## Dependencies

- `next-auth` - Session management
- `react` - UI framework
- `lucide-react` - Icons
- `sonner` - Toast notifications
- Tailwind CSS - Styling

All dependencies already in your project.
