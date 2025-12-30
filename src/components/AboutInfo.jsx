import styles from "./AboutInfo.module.css";

export default function AboutInfo() {
  return (
    <section className={styles.frameSection}>
      <div className={styles.frameInner}>
        <h2 className={styles.title}>وقف الصالح الخيري</h2>
        <p className={styles.text}>
          لَأنّ الدنيا وما فيها لا تَسوى عند الله جناح بعوضة، تم بفضل الله
          وتوفيقه تدشين وقف الصالح الخيري - بمكة المكرمة.
        </p>
        <p className={styles.text}>
          وقف الصالح الخيري مخصص لرعاية طلاب العلم ومساندتهم في سبيل تحصيلهم
          للعلم والقيام بواجب الدعوة إلى الله تعالى على منهج أهل السنة والجماعة.
        </p>
        <p className={styles.text}>
          كما أنه يستهدف أبواب البر والخير عمومًا في حال وجود فائض أو حاجة
          طارئة تتطلب الانتقال إلى المصارف الأخرى قبل طلاب العلم.
        </p>

        <div className={styles.goalsBlock}>
          <div className={styles.goalsTitle}>الأهداف</div>
          <ul className={styles.list}>
            <li>تحقيق غبطة الواقف وإجراء الأجر عليه.</li>
            <li>
              رعاية طلبة العلم وإعانتهم على تحصيله ومن ثم الدعوة إلى الله على
              بصيرة.
            </li>
            <li>المساهمة في أبواب البر والخير عمومًا.</li>
            <li>تنمية الوقف بالاستثمار وفق اللوائح والأنظمة.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

