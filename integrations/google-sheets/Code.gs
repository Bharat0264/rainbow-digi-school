/**
 * Rainbow Digi School — Admissions Enquiry Webhook & Google Sheets Storage
 * 
 * Target Spreadsheet Columns:
 * 1. Reference       (e.g., RDS-ENQ-2026-XXXXXXXXXX)
 * 2. Submitted At   (ISO 8601 / IST Formatted)
 * 3. Parent Name    (Full name of parent/guardian)
 * 4. Mobile         (10-digit Indian mobile number)
 * 5. Email          (Optional email address)
 * 6. Class          (Nursery, LKG, UKG, Grades 1-5)
 * 7. Message        (Optional enquiry message)
 * 8. Status         (Initial status: NEW)
 * 
 * Required Script Properties:
 * - SHARED_SECRET: Secret key shared between Vercel API and Google Apps Script
 * - NOTIFICATION_EMAIL: School admissions inbox (e.g. rainbowdigischool01@gmail.com)
 * - SHEET_ID: (Optional if script is bound to the spreadsheet)
 */

var ALLOWED_PROGRAMS = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5"
];

var HEADERS = [
  "Reference",
  "Submitted At",
  "Parent Name",
  "Mobile",
  "Email",
  "Class",
  "Message",
  "Status"
];

/**
 * Handle incoming POST requests from the Vercel API.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 20 seconds for other concurrent writes to complete
  var hasLock = lock.tryLock(20000);
  if (!hasLock) {
    return jsonResponse({
      success: false,
      error: "Server busy. Please try again."
    }, 503);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Empty request payload." }, 400);
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: "Invalid JSON payload." }, 400);
    }

    var properties = PropertiesService.getScriptProperties();
    var expectedSecret = properties.getProperty("SHARED_SECRET");

    if (!expectedSecret || expectedSecret.length < 16) {
      console.error("configuration_missing_shared_secret");
      return jsonResponse({
        success: false,
        error: "Server configuration error. SHARED_SECRET is not configured."
      }, 500);
    }

    // Verify shared secret (from payload body or query parameter)
    var providedSecret = payload.secret || (e.parameter && e.parameter.secret);
    if (!providedSecret || !isSecretMatch(expectedSecret, providedSecret)) {
      console.warn("unauthorized_submission_attempt");
      return jsonResponse({ success: false, error: "Unauthorized." }, 401);
    }

    // Validate input fields
    var validation = validatePayload(payload);
    if (!validation.valid) {
      return jsonResponse({
        success: false,
        error: validation.error,
        fields: validation.fields
      }, 422);
    }

    var data = validation.data;
    var sheet = getTargetSheet(properties);
    if (!sheet) {
      console.error("spreadsheet_unavailable");
      return jsonResponse({
        success: false,
        error: "Unable to access the destination spreadsheet."
      }, 500);
    }

    ensureHeaders(sheet);

    // Idempotency: Check if this reference number already exists
    var existingRow = findRowByReference(sheet, data.reference);
    if (existingRow > 0) {
      console.info("duplicate_enquiry_ignored: " + data.reference);
      return jsonResponse({
        success: true,
        enquiryNumber: data.reference,
        duplicate: true,
        emailSent: false,
        message: "Enquiry already recorded."
      }, 200);
    }

    // Prepare row with formula injection protection
    var row = [
      sanitizeCellValue(data.reference),
      sanitizeCellValue(data.submittedAt),
      sanitizeCellValue(data.parentName),
      sanitizeCellValue(data.phone),
      sanitizeCellValue(data.email || ""),
      sanitizeCellValue(data.program),
      sanitizeCellValue(data.message || ""),
      "NEW"
    ];

    sheet.appendRow(row);
    SpreadsheetApp.flush();
    console.info("enquiry_stored: " + data.reference);

    // Send email notification to the admissions desk
    var emailResult = sendNotificationEmail(data, properties);

    return jsonResponse({
      success: true,
      enquiryNumber: data.reference,
      duplicate: false,
      emailSent: emailResult.success
    }, 201);

  } catch (err) {
    console.error("storage_execution_failure: " + (err.message || err));
    return jsonResponse({
      success: false,
      error: "Failed to store enquiry in spreadsheet."
    }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (lockErr) {
      // Ignore release errors
    }
  }
}

/**
 * Handle incoming GET requests for endpoint health check.
 */
function doGet(e) {
  return jsonResponse({
    status: "ok",
    service: "Rainbow Digi School Admissions Webhook",
    timestamp: new Date().toISOString()
  }, 200);
}

/**
 * Validates the enquiry payload fields.
 */
function validatePayload(payload) {
  var fields = {};

  var reference = (payload.reference || "").trim();
  if (!/^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(reference)) {
    fields.reference = "Invalid enquiry reference format.";
  }

  var parentName = (payload.parentName || "").trim();
  if (parentName.length < 2 || parentName.length > 100) {
    fields.parentName = "Parent name must be between 2 and 100 characters.";
  }

  var phone = (payload.phone || "").replace(/[\s()-]/g, "").trim();
  if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
    fields.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  var email = (payload.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = "Enter a valid email address.";
  }

  var program = (payload.program || "").trim();
  if (ALLOWED_PROGRAMS.indexOf(program) === -1) {
    fields.program = "Select a valid class from Nursery to Grade 5.";
  }

  var message = (payload.message || "").trim();
  if (message.length > 1000) {
    fields.message = "Message cannot exceed 1,000 characters.";
  }

  if (payload.consent !== true) {
    fields.consent = "Consent to be contacted is required.";
  }

  if (Object.keys(fields).length > 0) {
    return { valid: false, error: "Validation failed.", fields: fields };
  }

  var submittedAt = payload.submittedAt || new Date().toISOString();

  return {
    valid: true,
    data: {
      reference: reference,
      submittedAt: submittedAt,
      parentName: parentName,
      phone: phone,
      email: email,
      program: program,
      message: message,
      consent: true
    }
  };
}

/**
 * Protects against CSV / Spreadsheet formula injection.
 * If a value begins with =, +, -, @, tab, or newline, prefix it with a single quote.
 */
function sanitizeCellValue(value) {
  if (value === null || value === undefined) return "";
  var str = String(value);
  if (/^[\=\+\-\@\t\r%]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Constant-time comparison for secrets to prevent timing attacks.
 */
function isSecretMatch(expected, provided) {
  if (typeof expected !== "string" || typeof provided !== "string") return false;
  if (expected.length !== provided.length) return false;
  var result = 0;
  for (var i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Retrieves the destination spreadsheet sheet.
 */
function getTargetSheet(properties) {
  var sheetId = properties.getProperty("SHEET_ID");
  var spreadsheet;
  if (sheetId && sheetId.trim().length > 0) {
    spreadsheet = SpreadsheetApp.openById(sheetId.trim());
  } else {
    try {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      spreadsheet = null;
    }
  }

  if (!spreadsheet) return null;

  var sheetName = properties.getProperty("SHEET_NAME") || "Enquiries";
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    // If designated sheet doesn't exist, use the active sheet or create it
    sheet = spreadsheet.getSheetByName("Sheet1") || spreadsheet.getSheets()[0];
    if (sheet) {
      sheet.setName(sheetName);
    } else {
      sheet = spreadsheet.insertSheet(sheetName);
    }
  }
  return sheet;
}

/**
 * Ensures header row is present in the sheet.
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    var range = sheet.getRange(1, 1, 1, HEADERS.length);
    range.setFontWeight("bold");
    range.setBackground("#F3EDE4"); // Soft warm paper tone
    sheet.setFrozenRows(1);
  }
}

/**
 * Searches column 1 for an existing reference number to guarantee idempotency.
 */
function findRowByReference(sheet, reference) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;

  var referenceColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < referenceColumn.length; i++) {
    var cellValue = String(referenceColumn[i][0]).replace(/^'/, "");
    if (cellValue === reference) {
      return i + 2; // Row index is 1-based, offset by header
    }
  }
  return 0;
}

/**
 * Sends notification email to the school admissions desk.
 * Errors do not fail the overall enquiry storage.
 */
function sendNotificationEmail(data, properties) {
  var recipient = properties.getProperty("NOTIFICATION_EMAIL");
  if (!recipient || recipient.indexOf("@") === -1) {
    console.info("email_notification_skipped_no_recipient");
    return { success: false, reason: "No recipient configured" };
  }

  try {
    var quota = MailApp.getRemainingDailyQuota();
    if (quota <= 0) {
      console.warn("email_quota_exceeded: Daily quota reached");
      return { success: false, reason: "Daily quota reached" };
    }

    var subject = "[New Admission Enquiry] " + data.reference + " - " + data.program + " (" + data.parentName + ")";
    
    var plainBody = [
      "New Admission Enquiry Received",
      "----------------------------------------",
      "Reference: " + data.reference,
      "Submitted At: " + data.submittedAt,
      "Parent / Guardian Name: " + data.parentName,
      "Mobile Number: " + data.phone,
      "Email: " + (data.email || "Not provided"),
      "Class of Interest: " + data.program,
      "Message: " + (data.message || "No additional message"),
      "Consent: Confirmed",
      "----------------------------------------",
      "View all enquiries in your Rainbow Digi School Google Sheet."
    ].join("\n");

    var htmlBody = [
      "<div style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; max-width: 600px; color: #2C241E;'>",
      "<h2 style='color: #193E50; margin-bottom: 8px;'>New Admission Enquiry Received</h2>",
      "<p style='color: #6B5E55; margin-top: 0;'>A parent has submitted an admissions enquiry through the Rainbow Digi School website.</p>",
      "<div style='background-color: #FAF6F0; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #E4D8C8;'>",
      "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>",
      "<tr><td style='padding: 6px 0; font-weight: bold; width: 140px;'>Reference:</td><td style='color: #D95E1E; font-weight: bold;'>" + escapeHtml(data.reference) + "</td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold;'>Parent Name:</td><td>" + escapeHtml(data.parentName) + "</td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold;'>Mobile Number:</td><td><a href='tel:" + escapeHtml(data.phone) + "' style='color: #193E50; text-decoration: underline; font-weight: bold;'>" + escapeHtml(data.phone) + "</a></td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold;'>Email:</td><td>" + (data.email ? "<a href='mailto:" + escapeHtml(data.email) + "' style='color: #193E50;'>" + escapeHtml(data.email) + "</a>" : "<em>Not provided</em>") + "</td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold;'>Class of Interest:</td><td><span style='background: #EAF4F2; color: #17322A; padding: 2px 8px; border-radius: 12px; font-weight: bold;'>" + escapeHtml(data.program) + "</span></td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold; vertical-align: top;'>Message:</td><td>" + (data.message ? escapeHtml(data.message) : "<em>None provided</em>") + "</td></tr>",
      "<tr><td style='padding: 6px 0; font-weight: bold;'>Submitted At:</td><td style='color: #6B5E55;'>" + escapeHtml(data.submittedAt) + "</td></tr>",
      "</table>",
      "</div>",
      "<p style='font-size: 13px; color: #8A7B70;'>This is an automated notification from your Rainbow Digi School Admissions Webhook.</p>",
      "</div>"
    ].join("");

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });

    console.info("email_notification_sent: " + data.reference);
    return { success: true };
  } catch (err) {
    console.error("email_notification_failed: " + (err.message || err));
    return { success: false, error: err.message || err };
  }
}

/**
 * Escapes HTML characters for safe rendering in email.
 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formats JSON response for ContentService.
 */
function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
