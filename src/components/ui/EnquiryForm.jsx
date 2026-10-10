import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const programs = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
];

export default function EnquiryForm({
  idPrefix = "enquiry",
  submitLabel = "Send enquiry",
}) {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const statusRef = useRef(null);
  const fieldId = (name) => `${idPrefix}-${name}`;
  const describedBy = (name) =>
    errors[name] ? `${fieldId(name)}-error` : undefined;

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.consent = data.consent === "on";
    const nextErrors = {};
    if (data.parentName.trim().length < 2)
      nextErrors.parentName = "Enter your name (at least 2 characters).";
    if (!/^(?:\+91)?[6-9]\d{9}$/.test(data.phone.replace(/[\s()-]/g, "")))
      nextErrors.phone =
        "Enter a 10-digit Indian mobile number, optionally beginning with +91.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!programs.includes(data.program))
      nextErrors.program = "Select a class.";
    if (!data.consent)
      nextErrors.consent = "Please agree to be contacted about this enquiry.";
    setErrors(nextErrors);
    setStatus({ type: "", message: "" });
    if (Object.keys(nextErrors).length) {
      form.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    submitting.current = true;
    setPending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => ({}));
      if (
        response.status === 201 &&
        typeof result.enquiryNumber === "string" &&
        /^RDS-ENQ-\d{4}-[A-F0-9]{10}$/.test(result.enquiryNumber)
      ) {
        setStatus({
          type: "success",
          message: `Your enquiry has been saved. Reference: ${result.enquiryNumber}. Please keep this reference for your conversation with the admissions team.`,
        });
        form.reset();
      } else {
        if (result.fields)
          setErrors(
            Object.fromEntries(
              Object.entries(result.fields)
                .filter(
                  ([name, values]) =>
                    [
                      "parentName",
                      "phone",
                      "email",
                      "program",
                      "message",
                      "consent",
                    ].includes(name) && Array.isArray(values),
                )
                .map(([name, values]) => [name, values[0]]),
            ),
          );
        setStatus({
          type: "error",
          message:
            response.status === 429
              ? "Too many attempts. Please wait a few minutes before trying again."
              : result.error ||
                "Your enquiry could not be confirmed. Please try again later.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message:
          "We could not confirm whether your enquiry was saved. Check your connection and try again later; resubmitting may create a duplicate.",
      });
    } finally {
      window.clearTimeout(timeout);
      submitting.current = false;
      setPending(false);
      window.setTimeout(() => statusRef.current?.focus(), 0);
    }
  }

  const error = (name) =>
    errors[name] && (
      <span className="field-error" id={`${fieldId(name)}-error`}>
        {errors[name]}
      </span>
    );
  return (
    <form
      className="premium-form"
      method="post"
      action="/api/enquiries"
      onSubmit={submit}
      noValidate
      aria-busy={pending}
    >
      <noscript>
        This online form needs JavaScript. Please use the school’s phone or
        email links on this page to enquire.
      </noscript>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={fieldId("parentName")}>
            Parent or guardian name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("parentName")}
            name="parentName"
            autoComplete="name"
            required
            maxLength={100}
            aria-invalid={!!errors.parentName}
            aria-describedby={describedBy("parentName")}
          />
          {error("parentName")}
        </div>
        <div className="form-field">
          <label htmlFor={fieldId("phone")}>
            Mobile number <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={24}
            placeholder="10-digit mobile number"
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
          />
          {error("phone")}
        </div>
        <div className="form-field">
          <label htmlFor={fieldId("email")}>Email (optional)</label>
          <input
            id={fieldId("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
          />
          {error("email")}
        </div>
        <div className="form-field">
          <label htmlFor={fieldId("program")}>
            Class of interest <span aria-hidden="true">*</span>
          </label>
          <select
            id={fieldId("program")}
            name="program"
            required
            aria-invalid={!!errors.program}
            aria-describedby={describedBy("program")}
            defaultValue=""
          >
            <option value="" disabled>
              Select a class
            </option>
            {programs.map((program) => (
              <option key={program}>{program}</option>
            ))}
          </select>
          {error("program")}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={fieldId("message")}>Your question (optional)</label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          maxLength={1000}
          aria-invalid={!!errors.message}
          aria-describedby={`${fieldId("message")}-hint${errors.message ? ` ${describedBy("message")}` : ""}`}
        />
        <small id={`${fieldId("message")}-hint`}>
          Please do not include your child's full name, medical information or
          identity documents.
        </small>
        {error("message")}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clipPath: "inset(50%)",
        }}
      >
        <label htmlFor={fieldId("website")}>Leave this field empty</label>
        <input
          id={fieldId("website")}
          name="website"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
      <div className="form-field form-consent">
        <label htmlFor={fieldId("consent")}>
          <input
            id={fieldId("consent")}
            name="consent"
            type="checkbox"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
          />{" "}
          I agree that Rainbow Digi School may use these details to respond to
          my admission enquiry.
        </label>
        {error("consent")}
      </div>
      <p className="form-privacy">
        Your contact details and enquiry are stored to help the school respond.
        Read the <Link to="/privacy-policy">privacy notice</Link>. Fields marked
        * are required.
      </p>
      <button
        className="button button-primary"
        type="submit"
        disabled={pending}
      >
        {pending ? "Sending enquiry…" : submitLabel}
      </button>
      <div
        ref={statusRef}
        tabIndex={-1}
        className={`form-notice ${status.type}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status.message}
      </div>
    </form>
  );
}
