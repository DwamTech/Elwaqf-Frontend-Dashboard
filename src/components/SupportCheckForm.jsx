"use client";

import { useState } from "react";
import styles from "./SupportCheckForm.module.css";

export default function SupportCheckForm() {
  const [reqId, setReqId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!reqId || reqId.trim().length < 3) errors.reqId = "رقم الطلب مطلوب";
    const phoneRe = /^[0-9]{9,15}$/;
    if (!phoneRe.test(phone)) errors.phone = "يرجى إدخال رقم جوال صحيح";
    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setStatus({ type: "error", text: "يرجى تصحيح الأخطاء ثم المحاولة" });
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setStatus({ type: "success", text: "تم العثور على طلبك، سيتم التواصل معك قريبًا" });
  };

  return (
    <section className={styles.section} dir="rtl">
      <div className={styles.card}>
        <h2 className={styles.title}>أدخل بيانات الطلب</h2>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reqId">رقم الطلب الخاص بك</label>
            <input
              id="reqId"
              name="reqId"
              type="text"
              className={styles.input}
              value={reqId}
              onChange={(e) => setReqId(e.target.value)}
              placeholder="اكتب رقم الطلب"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">رقم الهاتف الخاص بك</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="966123456789"
              dir="ltr"
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.submit} type="submit" disabled={submitting}>
              {submitting ? "جاري التحقق..." : "تحقق الآن"}
            </button>
            {status.text && (
              <span className={`${styles.status} ${status.type === "success" ? styles.statusSuccess : styles.statusError}`}>
                {status.text}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
