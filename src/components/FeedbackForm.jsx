"use client";

import { useState } from "react";
import { FaUser, FaEnvelope, FaRegCommentDots } from "react-icons/fa";
import styles from "./FeedbackForm.module.css";

export default function FeedbackForm({ title, description, submitLabel = "إرسال" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!name || name.trim().length < 2) e.name = "الاسم مطلوب وبحد أدنى حرفين";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) e.email = "يرجى إدخال بريد إلكتروني صحيح";
    if (!message || message.trim().length < 10) e.message = "الرسالة مطلوبة وبحد أدنى 10 أحرف";
    return e;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setStatus({ type: "", text: "" });
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setStatus({ type: "error", text: "يرجى تصحيح الأخطاء ثم المحاولة مرة أخرى" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStatus({ type: "success", text: "تم إرسال طلبك بنجاح" });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className={styles.section} dir="rtl">
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.desc}>{description}</p>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.srOnly}`} htmlFor="name">الاسم</label>
            <div className={styles.control}>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name) || undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder=" "
                autoComplete="name"
              />
              <span className={styles.flabel}>الاسم</span>
              <FaUser className={styles.icon} aria-hidden />
            </div>
            {errors.name && <span id="name-error" className={styles.error}>{errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={`${styles.label} ${styles.srOnly}`} htmlFor="email">البريد الإلكتروني</label>
            <div className={styles.control}>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email) || undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder=" "
                autoComplete="email"
                dir="ltr"
              />
              <span className={styles.flabel}>البريد الإلكتروني</span>
              <FaEnvelope className={styles.icon} aria-hidden />
            </div>
            {errors.email && <span id="email-error" className={styles.error}>{errors.email}</span>}
          </div>

          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={`${styles.label} ${styles.srOnly}`} htmlFor="message">الرسالة</label>
            <div className={styles.control}>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-invalid={Boolean(errors.message) || undefined}
                aria-describedby={errors.message ? "message-error" : undefined}
                placeholder=" "
              />
              <span className={styles.flabel}>الرسالة</span>
              <FaRegCommentDots className={styles.icon} aria-hidden />
            </div>
            {errors.message && <span id="message-error" className={styles.error}>{errors.message}</span>}
          </div>

          <div className={`${styles.fieldFull} ${styles.actions}`}>
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? "جاري الإرسال..." : submitLabel}
            </button>
            {status.text && (
              <span
                className={`${styles.status} ${
                  status.type === "success" ? styles.statusSuccess : styles.statusError
                }`}
                role="status"
              >
                {status.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
