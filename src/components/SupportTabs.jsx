"use client";

import { useMemo, useState } from "react";
import styles from "./SupportTabs.module.css";
import CustomSelect from "./CustomSelect";

function useErrors() {
  const [errors, setErrors] = useState({});
  return { errors, setErrors };
}

function validateRequired(fields) {
  const e = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined || val === null) continue;
    if (typeof val === "string" && val.trim() === "") e[key] = "هذا الحقل مطلوب";
  }
  return e;
}

function IndividualForm() {
  const { errors, setErrors } = useErrors();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    nationality: "",
    city: "",
    housing: "",
    housingOther: "",
    idImage: null,
    birthDate: "",
    expiryDate: "",
    phone: "",
    whatsapp: "",
    email: "",
    educationImage: null,
    activity: "",
    activityOther: "",
    cvFile: null,
    workplace: "",
    supportType: "",
    totalAmount: "",
    supportKind: "",
    supportKindOther: "",
    income: "",
    incomeOther: "",
    married: "",
    familyCount: "",
    recommendationsFile: null,
    iban: "",
    bank: "",
  });
  const isHousingOther = form.housing === "other";
  const isActivityOther = form.activity === "other";
  const isIncomeYes = form.income === "yes";
  const isMarriedYes = form.married === "yes";
  const isSupportKindOther = form.supportKind === "other";

  const onInput = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const onFile = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.files?.[0] || null }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const required = {
      name: form.name,
      gender: form.gender,
      nationality: form.nationality,
      city: form.city,
      housing: form.housing,
      idImage: form.idImage ? "x" : "",
      birthDate: form.birthDate,
      expiryDate: form.expiryDate,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      educationImage: form.educationImage ? "x" : "",
      activity: form.activity,
      cvFile: form.cvFile ? "x" : "",
      workplace: form.workplace,
      supportType: form.supportType,
      totalAmount: form.totalAmount,
      supportKind: form.supportKind,
      income: form.income,
      married: form.married,
      iban: form.iban,
      bank: form.bank,
    };
    if (isHousingOther) required.housingOther = form.housingOther;
    if (isActivityOther) required.activityOther = form.activityOther;
    if (isIncomeYes) required.incomeOther = form.incomeOther;
    if (isMarriedYes) required.familyCount = form.familyCount;
    if (isSupportKindOther) required.supportKindOther = form.supportKindOther;
    const e = validateRequired(required);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    await new Promise((r) => setTimeout(r, 1000));
    alert("تم إرسال طلب الفرد بنجاح");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} dir="rtl" noValidate id="individual-panel" role="tabpanel" aria-labelledby="individual-tab">
      <div className={styles.field}>
        <label className={styles.label}>الاسم *</label>
        <input className={styles.input} value={form.name} onChange={onInput("name")} />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الجنس *</label>
        <CustomSelect
          value={form.gender}
          onChange={(v) => setForm((f) => ({ ...f, gender: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "male", label: "ذكر" },
            { value: "female", label: "أنثى" },
          ]}
          placeholder="اختر"
        />
        {errors.gender && <span className={styles.error}>{errors.gender}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الجنسية *</label>
        <input className={styles.input} value={form.nationality} onChange={onInput("nationality")} />
        {errors.nationality && <span className={styles.error}>{errors.nationality}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>المدينة *</label>
        <input className={styles.input} value={form.city} onChange={onInput("city")} />
        {errors.city && <span className={styles.error}>{errors.city}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>نوع السكن *</label>
        <CustomSelect
          value={form.housing}
          onChange={(v) => setForm((f) => ({ ...f, housing: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "own", label: "ملك" },
            { value: "rent", label: "ايجار" },
            { value: "waqf", label: "وقف" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.housing && <span className={styles.error}>{errors.housing}</span>}
      </div>
      {isHousingOther && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر نوع السكن</label>
          <input className={styles.input} value={form.housingOther} onChange={onInput("housingOther")} />
          {errors.housingOther && <span className={styles.error}>{errors.housingOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>صورة الهوية *</label>
        <input className={styles.file} type="file" accept="image/*" onChange={onFile("idImage")} />
        {errors.idImage && <span className={styles.error}>{errors.idImage}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>تاريخ الميلاد *</label>
        <input className={styles.input} type="date" value={form.birthDate} onChange={onInput("birthDate")} />
        {errors.birthDate && <span className={styles.error}>{errors.birthDate}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>تاريخ الانتهاء *</label>
        <input className={styles.input} type="date" value={form.expiryDate} onChange={onInput("expiryDate")} />
        {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الاتصال *</label>
        <input className={styles.input} type="tel" value={form.phone} onChange={onInput("phone")} dir="ltr" />
        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الواتساب</label>
        <input className={styles.input} type="tel" value={form.whatsapp} onChange={onInput("whatsapp")} placeholder="966123456789" dir="ltr" />
        {errors.whatsapp && <span className={styles.error}>{errors.whatsapp}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>البريد الالكتروني *</label>
        <input className={styles.input} type="email" value={form.email} onChange={onInput("email")} dir="ltr" />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>المؤهل الدراسي *</label>
        <input className={styles.file} type="file" accept="image/*,application/pdf" onChange={onFile("educationImage")} />
        {errors.educationImage && <span className={styles.error}>{errors.educationImage}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>النشاط العلمي *</label>
        <CustomSelect
          value={form.activity}
          onChange={(v) => setForm((f) => ({ ...f, activity: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "aqeeda", label: "عقدي" },
            { value: "sunna", label: "سنة وحديث" },
            { value: "fiqh", label: "فقهي" },
            { value: "fikri", label: "فكري" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.activity && <span className={styles.error}>{errors.activity}</span>}
      </div>
      {isActivityOther && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر النشاط</label>
          <input className={styles.input} value={form.activityOther} onChange={onInput("activityOther")} />
          {errors.activityOther && <span className={styles.error}>{errors.activityOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>السيرة الذاتية *</label>
        <input className={styles.file} type="file" accept="application/pdf" onChange={onFile("cvFile")} />
        {errors.cvFile && <span className={styles.error}>{errors.cvFile}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>مكان العمل *</label>
        <input className={styles.input} value={form.workplace} onChange={onInput("workplace")} />
        {errors.workplace && <span className={styles.error}>{errors.workplace}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الدعم المطلوب *</label>
        <CustomSelect
          value={form.supportType}
          onChange={(v) => setForm((f) => ({ ...f, supportType: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "full", label: "كلي" },
            { value: "partial", label: "جزئي" },
          ]}
          placeholder="اختر"
        />
        {errors.supportType && <span className={styles.error}>{errors.supportType}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>إجمالي المبلغ المطلوب *</label>
        <input className={styles.input} type="number" min="0" value={form.totalAmount} onChange={onInput("totalAmount")} />
        {errors.totalAmount && <span className={styles.error}>{errors.totalAmount}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>نوع الدعم *</label>
        <CustomSelect
          value={form.supportKind}
          onChange={(v) => setForm((f) => ({ ...f, supportKind: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "bar", label: "على أوجه البر العامة" },
            { value: "poor", label: "الفقراء" },
            { value: "orphans", label: "الأيتام" },
            { value: "dawah", label: "الدعوة" },
            { value: "quran", label: "القرآن وتعليمه" },
            { value: "udhiyah", label: "الأضاحي" },
            { value: "education", label: "التعليم" },
            { value: "mosques", label: "المساجد" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.supportKind && <span className={styles.error}>{errors.supportKind}</span>}
      </div>
      {isSupportKindOther && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر نوع الدعم</label>
          <input className={styles.input} value={form.supportKindOther} onChange={onInput("supportKindOther")} />
          {errors.supportKindOther && <span className={styles.error}>{errors.supportKindOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>هل يوجد دخل *</label>
        <CustomSelect
          value={form.income}
          onChange={(v) => setForm((f) => ({ ...f, income: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "no", label: "لا" },
            { value: "yes", label: "نعم اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.income && <span className={styles.error}>{errors.income}</span>}
      </div>
      {isIncomeYes && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر نوع الدخل</label>
          <input className={styles.input} value={form.incomeOther} onChange={onInput("incomeOther")} />
          {errors.incomeOther && <span className={styles.error}>{errors.incomeOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>متزوج *</label>
        <CustomSelect
          value={form.married}
          onChange={(v) => setForm((f) => ({ ...f, married: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "no", label: "لا" },
            { value: "yes", label: "نعم اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.married && <span className={styles.error}>{errors.married}</span>}
      </div>
      {isMarriedYes && (
        <div className={styles.field}>
          <label className={styles.label}>عدد أفراد الأسرة</label>
          <input className={styles.input} type="number" min="1" value={form.familyCount} onChange={onInput("familyCount")} />
          {errors.familyCount && <span className={styles.error}>{errors.familyCount}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>توصيات و تزكيات</label>
        <input className={styles.file} type="file" accept="application/pdf" onChange={onFile("recommendationsFile")} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الحساب البنكي (IBAN) *</label>
        <input className={styles.input} value={form.iban} onChange={onInput("iban")} dir="ltr" />
        {errors.iban && <span className={styles.error}>{errors.iban}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>اسم البنك *</label>
        <input className={styles.input} value={form.bank} onChange={onInput("bank")} />
        {errors.bank && <span className={styles.error}>{errors.bank}</span>}
      </div>
      <div className={`${styles.actions} ${styles.full}`}>
        <button className={styles.submit} type="submit">إرسال الفورم</button>
      </div>
    </form>
  );
}

function OrganizationForm() {
  const { errors, setErrors } = useErrors();
  const [goals, setGoals] = useState([""]);
  const [form, setForm] = useState({
    orgName: "",
    licenseNo: "",
    licenseCert: null,
    email: "",
    supportLetter: null,
    phone: "",
    ceoName: "",
    ceoPhone: "",
    whatsapp: "",
    city: "",
    activity: "",
    activityOther: "",
    projectName: "",
    projectKind: "",
    projectKindOther: "",
    projectFile: null,
    projectManager: "",
    projectManagerPhone: "",
    beneficiaries: "",
    beneficiariesOther: "",
    totalCost: "",
    outputs: "",
    opPlanFile: null,
    supportType: "",
    totalAmount: "",
    accountName: "",
    iban: "",
    bank: "",
    bankCert: null,
  });

  const isActivityOther = form.activity === "other";
  const isProjectKindOther = form.projectKind === "other";
  const isBeneficiariesOther = form.beneficiaries === "other";

  const onInput = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.value }));
  const onFile = (k) => (ev) => setForm((f) => ({ ...f, [k]: ev.target.files?.[0] || null }));

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const required = {
      orgName: form.orgName,
      licenseNo: form.licenseNo,
      licenseCert: form.licenseCert ? "x" : "",
      email: form.email,
      supportLetter: form.supportLetter ? "x" : "",
      phone: form.phone,
      ceoName: form.ceoName,
      ceoPhone: form.ceoPhone,
      city: form.city,
      activity: form.activity,
      projectName: form.projectName,
      projectKind: form.projectKind,
      projectFile: form.projectFile ? "x" : "",
      projectManager: form.projectManager,
      projectManagerPhone: form.projectManagerPhone,
      beneficiaries: form.beneficiaries,
      totalCost: form.totalCost,
      outputs: form.outputs,
      opPlanFile: form.opPlanFile ? "x" : "",
      supportType: form.supportType,
      totalAmount: form.totalAmount,
      accountName: form.accountName,
      iban: form.iban,
      bank: form.bank,
      bankCert: form.bankCert ? "x" : "",
    };
    if (isActivityOther) required.activityOther = form.activityOther;
    if (isProjectKindOther) required.projectKindOther = form.projectKindOther;
    if (isBeneficiariesOther) required.beneficiariesOther = form.beneficiariesOther;
    if (!goals[0] || goals[0].trim() === "") required.goal1 = "";
    const e = validateRequired(required);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    await new Promise((r) => setTimeout(r, 1000));
    alert("تم إرسال فورم المؤسسة بنجاح");
  };

  const addGoal = () => setGoals((g) => (g.length < 6 ? [...g, ""] : g));
  const updateGoal = (i, v) => setGoals((g) => g.map((x, idx) => (idx === i ? v : x)));

  return (
    <form className={styles.form} onSubmit={onSubmit} dir="rtl" noValidate id="organization-panel" role="tabpanel" aria-labelledby="organization-tab">
      <div className={styles.field}>
        <label className={styles.label}>اسم المؤسسة أو الجمعية *</label>
        <input className={styles.input} value={form.orgName} onChange={onInput("orgName")} />
        {errors.orgName && <span className={styles.error}>{errors.orgName}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الترخيص *</label>
        <input className={styles.input} value={form.licenseNo} onChange={onInput("licenseNo")} />
        {errors.licenseNo && <span className={styles.error}>{errors.licenseNo}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>شهادة الترخيص *</label>
        <input className={styles.file} type="file" accept="application/pdf,image/*" onChange={onFile("licenseCert")} />
        {errors.licenseCert && <span className={styles.error}>{errors.licenseCert}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>البريد الالكتروني *</label>
        <input className={styles.input} type="email" value={form.email} onChange={onInput("email")} dir="ltr" />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>خطاب الدعم *</label>
        <input className={styles.file} type="file" accept="application/pdf" onChange={onFile("supportLetter")} />
        {errors.supportLetter && <span className={styles.error}>{errors.supportLetter}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الجوال *</label>
        <input className={styles.input} type="tel" value={form.phone} onChange={onInput("phone")} dir="ltr" />
        {errors.phone && <span className={styles.error}>{errors.phone}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>اسم المدير التنفيذي *</label>
        <input className={styles.input} value={form.ceoName} onChange={onInput("ceoName")} />
        {errors.ceoName && <span className={styles.error}>{errors.ceoName}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>جوال المدير *</label>
        <input className={styles.input} type="tel" value={form.ceoPhone} onChange={onInput("ceoPhone")} dir="ltr" />
        {errors.ceoPhone && <span className={styles.error}>{errors.ceoPhone}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الواتساب</label>
        <input className={styles.input} type="tel" value={form.whatsapp} onChange={onInput("whatsapp")} placeholder="966123456789" dir="ltr" />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>المدينة *</label>
        <input className={styles.input} value={form.city} onChange={onInput("city")} />
        {errors.city && <span className={styles.error}>{errors.city}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>نوع النشاط *</label>
        <CustomSelect
          value={form.activity}
          onChange={(v) => setForm((f) => ({ ...f, activity: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "scientific", label: "علمي" },
            { value: "dawah", label: "دعوي" },
            { value: "social", label: "اجتماعي" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.activity && <span className={styles.error}>{errors.activity}</span>}
      </div>
      {isActivityOther && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر نوع النشاط</label>
          <input className={styles.input} value={form.activityOther} onChange={onInput("activityOther")} />
          {errors.activityOther && <span className={styles.error}>{errors.activityOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>اسم المشروع *</label>
        <input className={styles.input} value={form.projectName} onChange={onInput("projectName")} />
        {errors.projectName && <span className={styles.error}>{errors.projectName}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>نوع المشروع *</label>
        <CustomSelect
          value={form.projectKind}
          onChange={(v) => setForm((f) => ({ ...f, projectKind: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "bar", label: "على أوجه البر العامة" },
            { value: "poor", label: "الفقراء" },
            { value: "orphans", label: "الأيتام" },
            { value: "dawah", label: "الدعوة" },
            { value: "quran", label: "القرآن وتعليمه" },
            { value: "udhiyah", label: "الأضاحي" },
            { value: "education", label: "التعليم" },
            { value: "mosques", label: "المساجد" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.projectKind && <span className={styles.error}>{errors.projectKind}</span>}
      </div>
      {isProjectKindOther && (
        <div className={styles.field}>
          <label className={styles.label}>اذكر نوع المشروع</label>
          <input className={styles.input} value={form.projectKindOther} onChange={onInput("projectKindOther")} />
          {errors.projectKindOther && <span className={styles.error}>{errors.projectKindOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>ملف المشروع *</label>
        <input className={styles.file} type="file" accept="application/pdf" onChange={onFile("projectFile")} />
        {errors.projectFile && <span className={styles.error}>{errors.projectFile}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>مدير المشروع *</label>
        <input className={styles.input} value={form.projectManager} onChange={onInput("projectManager")} />
        {errors.projectManager && <span className={styles.error}>{errors.projectManager}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم جوال المدير *</label>
        <input className={styles.input} type="tel" value={form.projectManagerPhone} onChange={onInput("projectManagerPhone")} dir="ltr" />
        {errors.projectManagerPhone && <span className={styles.error}>{errors.projectManagerPhone}</span>}
      </div>
      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label}>أهداف المشروع (هدف واحد على الأقل) *</label>
        <div className={styles.goals}>
          {goals.map((g, i) => (
            <input key={i} className={styles.input} value={g} onChange={(e) => updateGoal(i, e.target.value)} placeholder={`الهدف ${i + 1}`} />
          ))}
          <button type="button" className={styles.addGoal} onClick={addGoal}>أهداف أخرى...</button>
        </div>
        {errors.goal1 && <span className={styles.error}>يرجى إدخال هدف واحد على الأقل</span>}
      </div>
      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label}>المستفيدون من المشروع *</label>
        <CustomSelect
          value={form.beneficiaries}
          onChange={(v) => setForm((f) => ({ ...f, beneficiaries: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "men", label: "رجال" },
            { value: "women", label: "نساء" },
            { value: "children", label: "اطفال" },
            { value: "all", label: "الجميع" },
            { value: "students", label: "طلبة علم" },
            { value: "pilgrims", label: "ضيوف الرحمن" },
            { value: "nonMuslims", label: "غير مسلمين" },
            { value: "other", label: "غير ذلك اذكره" },
          ]}
          placeholder="اختر"
        />
        {errors.beneficiaries && <span className={styles.error}>{errors.beneficiaries}</span>}
      </div>
      {isBeneficiariesOther && (
        <div className={`${styles.field} ${styles.full}`}>
          <label className={styles.label}>اذكر نوع المستفيدين</label>
          <input className={styles.input} value={form.beneficiariesOther} onChange={onInput("beneficiariesOther")} />
          {errors.beneficiariesOther && <span className={styles.error}>{errors.beneficiariesOther}</span>}
        </div>
      )}
      <div className={styles.field}>
        <label className={styles.label}>تكلفة المشروع (الإجمالي) *</label>
        <input className={styles.input} type="number" min="0" value={form.totalCost} onChange={onInput("totalCost")} />
        {errors.totalCost && <span className={styles.error}>{errors.totalCost}</span>}
      </div>
      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label}>مخرجات المشروع *</label>
        <textarea className={styles.textarea} value={form.outputs} onChange={onInput("outputs")} />
        {errors.outputs && <span className={styles.error}>{errors.outputs}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الخطة التشغيلية للمشروع *</label>
        <input className={styles.file} type="file" accept="application/pdf" onChange={onFile("opPlanFile")} />
        {errors.opPlanFile && <span className={styles.error}>{errors.opPlanFile}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الدعم المطلوب *</label>
        <CustomSelect
          value={form.supportType}
          onChange={(v) => setForm((f) => ({ ...f, supportType: v }))}
          options={[
            { value: "", label: "اختر" },
            { value: "full", label: "كلي" },
            { value: "partial", label: "جزئي" },
          ]}
          placeholder="اختر"
        />
        {errors.supportType && <span className={styles.error}>{errors.supportType}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>إجمالي المبلغ المطلوب *</label>
        <input className={styles.input} type="number" min="0" value={form.totalAmount} onChange={onInput("totalAmount")} />
        {errors.totalAmount && <span className={styles.error}>{errors.totalAmount}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>اسم الحساب *</label>
        <input className={styles.input} value={form.accountName} onChange={onInput("accountName")} />
        {errors.accountName && <span className={styles.error}>{errors.accountName}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>رقم الحساب البنكي (IBAN) *</label>
        <input className={styles.input} value={form.iban} onChange={onInput("iban")} dir="ltr" />
        {errors.iban && <span className={styles.error}>{errors.iban}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>اسم البنك *</label>
        <input className={styles.input} value={form.bank} onChange={onInput("bank")} />
        {errors.bank && <span className={styles.error}>{errors.bank}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>الشهادة البنكية *</label>
        <input className={styles.file} type="file" accept="application/pdf,image/*" onChange={onFile("bankCert")} />
        {errors.bankCert && <span className={styles.error}>{errors.bankCert}</span>}
      </div>
      <div className={`${styles.actions} ${styles.full}`}>
        <button className={styles.submit} type="submit">رفع الفورم</button>
      </div>
    </form>
  );
}

export default function SupportTabs() {
  const [tab, setTab] = useState("individual");
  return (
    <section className={styles.section} dir="rtl">
      <div className={styles.container}>
        <div className={styles.tabs} role="tablist" aria-label="اختيار نوع الفورم">
          <button
            role="tab"
            aria-selected={tab === "individual"}
            aria-controls="individual-panel"
            id="individual-tab"
            className={`${styles.tabBtn} ${tab === "individual" ? styles.tabBtnActive : ""}`}
            onClick={() => setTab("individual")}
          >
            فرد
          </button>
          <button
            role="tab"
            aria-selected={tab === "organization"}
            aria-controls="organization-panel"
            id="organization-tab"
            className={`${styles.tabBtn} ${tab === "organization" ? styles.tabBtnActive : ""}`}
            onClick={() => setTab("organization")}
          >
            مؤسسة
          </button>
        </div>
        {tab === "individual" ? <IndividualForm /> : <OrganizationForm />}
      </div>
    </section>
  );
}
