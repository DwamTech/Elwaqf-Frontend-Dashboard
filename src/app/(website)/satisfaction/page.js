"use client";
import { useState } from "react";
import HeroSection from "../../../components/HeroSection";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import styles from "./page.module.css";

export default function SatisfactionPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const average = 4.5;
  const count = 131;

  const stars = [1, 2, 3, 4, 5];

  return (
    <main className={styles.main}>
      <HeroSection
        title="تقيـيم رضا المستـفيديـن"
        imageSrc="/75884be2-3e9d-4126-ace3-770ef0c2f071_16x9_1200x676.webp"
        imageAlt="تقييم رضا المستفيدين"
        align="center"
      />

      <section className={styles.introSection}>
        <div className={styles.introCard}>
          <h2 className={styles.introTitle}>تقييم رضا المستفيدين</h2>
          <p className={styles.introText}>
            من أهم أسباب نمو قدراتنا ومواجهة تحدياتنا أن نتلقى مدى رضا المستفيدين منّا بكل سرور
            حتى نضع في خططنا المستقبلية ما يميّزنا ويزيد من رضاكم
          </p>
        </div>
      </section>

      <section className={styles.ratingSection}>
        <div className={styles.ratingInner}>
          <div className={styles.ratingHeader}>
            <span className={styles.label}>اضف تقييمك..</span>
            {/* <button
              type="button"
              className={styles.rateBtn}
              onClick={() => setRating(hover || rating)}
              aria-label="قيم الآن"
            >
              قيم الآن !!
            </button> */}
          </div>
          <div className={styles.placeholderStars} aria-hidden="true">
            <FaStar className={styles.starPlaceholder} />
            <FaStar className={styles.starPlaceholder} />
            <FaStar className={styles.starPlaceholder} />
            <FaStar className={styles.starPlaceholder} />
            <FaStarHalfAlt className={styles.starPlaceholderHalf} />
          </div>
          <div className={styles.stars} role="radiogroup" aria-label="اختيار التقييم">
            {stars.map((i) => {
              const active = (hover || rating) >= i;
              return (
                <button
                  key={i}
                  type="button"
                  className={styles.starBtn}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(i)}
                  aria-label={`تقييم ${i} من 5`}
                >
                  {active ? <FaStar className={styles.starActive} /> : <FaRegStar className={styles.star} />}
                </button>
              );
            })}
          </div>
          <div className={styles.ratingMeta}>
            <span className={styles.avg}>
              <FaStarHalfAlt size={16} /> متوسط التقييم {average} / 5
            </span>
            <span className={styles.sep} />
            <span className={styles.count}>عدد التقيمات: {count}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
