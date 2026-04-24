import { useRef, useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";

const BASE = import.meta.env.BASE_URL;

const GALLERY_PHOTO_NAMES = [
  "photo_5426876330701165032_y.jpg",
  "photo_5426876330701165033_y.jpg",
  "photo_5426876330701165034_y.jpg",
  "photo_5426876330701165035_y.jpg",
  "photo_5426876330701165036_y.jpg",
  "photo_5426876330701165037_y.jpg",
  "photo_5426876330701165038_y.jpg",
  "photo_5426876330701165039_y.jpg",
  "photo_5426876330701165040_y.jpg",
  "photo_5426876330701165041_y.jpg",
  "photo_5426876330701165042_y.jpg",
  "photo_5426876330701165043_y.jpg",
];
const GALLERY_PHOTOS = GALLERY_PHOTO_NAMES.map((n) => `${BASE}photos/${n}`);

const w = (from, text, file) => ({
  from,
  text,
  photo: file ? `${BASE}photos/wishes/${file}` : null,
});

const WISHES = [
  w(
    "Диана",
    `Лера, пусть никакой торт ни сломит твоей выдержки!\nПусть никакой неподанный платеж не пошевелит твою бровь!\nПусть никакая работа не отвлечет тебя от событий за окном!\nБудь счастлива!`,
    "1.jpg",
  ),
  w(
    "Алина",
    `Желаю чтобы всегда оставалась сочная, как это яблочко, даже без дефицита калорий!!!`,
    "2.jpg",
  ),
  w(
    "Лера Назарова",
    `Обещаю теперь впредь всегда сразу поворачиваться к тебе на дороге\nХэппи бёздэй!!! 🩷`,
    "3.jpg",
  ),
  w(
    "Саша Виткин",
    `Лерка, с днем рождения! ❤️\n\nТы самая лучшая столоседка, которая у меня была и есть. И не важно, что ты первая и единственная.\n\nЖелаю, чтобы в твоей жизни из неопознанного были только калории (потому что не нужно тебе их считать!), чтобы ты меньше уставала и больше улыбалась, а бабки липли к тебе как банный лист к жопе (я не про старух)`,
    "4.jpg",
  ),
  w(
    "Белка",
    `Лерка, с днем рождения!\n\nПомню с тобой весёлый момент, когда напились в Красилово — и как пробило колесо по дороге туда!\n\nЗнай, ты ахуенная! Хочется чтобы было больше совместных весёлых моментов!\n\nИ никогда ничего не утаивааааааай!!!!!!`,
    "5.jpg",
  ),
  w(
    "Саша Запкова",
    `Мой фаворит — когда ей пришлось покопаться в мусоре, чтобы найти своё кольцо 😄\n\nПусть с мужиками будет проще и не придётся ковыряться в куче «мусора», а сразу найдётся тот самый, который красиво преподнесёт заветное колечко 💍`,
    "6.jpg",
  ),
  w(
    "Лада",
    `Пусть твоя жизнь будет наполнена только приятными расходами 💸`,
    "7.jpg",
  ),
  w(
    "Ира",
    `Человек, который всегда следит за цветами, авариями и незаполненными платежами\n\nЛучший в своём роде носитель чепчиков\n\nТа, что терпит тупые вопросы по каждой копейке и 1000 раз поясняет за налоги\n\nВнезапное исполнение крутых песен — жёстко одобряю\n\nПросто лучшая! ❤️`,
    "8.jpg",
  ),
  w(
    "Саша Крестникова",
    `Лераааа, поздравляю тебя с днём рождения! 🎉\n\nТвои истории — это просто отдельный вид искусства, каждая запоминается и потом долго вспоминается со смехом 😄\n\nТы очень искренняя, настоящая и невероятно яркая. Оставайся такой же красивой, сильной и настоящей.\n\nИ я точно знаю, что для тебя найдётся тот самый, который будет носить тебя на руках... а не ставить прослушки в машину 😄\n\nКрепко тебя обнимаю! Ты правда очень классная ❤️`,
    "9.jpg",
  ),
  w(
    "Юля",
    `Лера, ты, блин, вообще крутая!! С твоим днём 🎂❤️\n\nДенег, тачек, бабок тебе — всё будет!!\n\nПусть твоё везение приумножается в геометрической прогрессии!\n\nПусть платежи подаются всегда вовремя и тебе не приходится напоминать про неопознанные ✨\n\nПродолжай сиять и улыбайся чаще 💋`,
    "10.jpg",
  ),
  w(
    "Катя",
    `Лерааааааааа, поздравляю тебя с Днём Рождения!

Из воспоминаний с тобой: я помню как мы сидели в офисе и в моменте ты сказала, что хочешь скумбрию и безалкогольное пиво, я подкинулась на эту идею и нам было так хорошо)))) (помним, что теперь берём скумбрию только холодного копчения))) 

Желаю тебе не ограничивать себя и кушать все самое вкусное и сладкое! 

Будь счастлива и самое главное здорова! 

Ты крутая❤️❤️`,
    "11.jpg",
  ),
  w(
    "Саша Панина",
    `Дорогая Лерочка, у нас нет с тобой совместной фотографии, но у нас есть гораздо больше - герб нашего рода))
А поэтому: "«Миллионы приходят и уходят, не в них счастье. Самым важным на свете всегда будут люди в этой комнате. За семью! ». 
Да прибудут рядом с тобой в этом году только верные, надежные, ответственные люди! ❤️`,
    "12.jpg",
  ),
  w(
    "От Бориса и Алёнки",
    `ЗДОРОВЬЯ в личной жизни потом пожелать чтобы ХУЙ стоял и деньги были! Чтобы Vista доехала до 2226 года! Чтобы не ЗАЁБЫВАЛИ с не отложенными платежами! Чтобы АВАКАДО рос большим и здоровым ! Чтобы бананы начали рости в России! Чтобы за окном происходило больше всякой ДИЧИ, чтобы ты могла посмотреть и не скучать!`,
    "13.jpg",
  ),
];

// ─── Particles ────────────────────────────────
function Particles() {
  const items = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    delay: (Math.random() * 30).toFixed(2),
    duration: (18 + Math.random() * 24).toFixed(2),
    size: (5 + Math.random() * 18).toFixed(1),
    left: (Math.random() * 100).toFixed(2),
    opacity: (0.2 + Math.random() * 0.4).toFixed(2),
  }));
  return (
    <div className="particles" aria-hidden="true">
      {items.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            "--delay": `${p.delay}s`,
            "--duration": `${p.duration}s`,
            "--size": `${p.size}px`,
            "--left": `${p.left}%`,
            "--opacity": p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── Photo collage finale ─────────────────────
const FINALE_PHOTOS = [
  { file: "photo_5426876330701165030_x.jpg", cls: "fp-left" },
  { file: "main.jpg", cls: "fp-center" },
  { file: "photo_5427197748873729680_x.jpg", cls: "fp-right" },
];

// Pre-computed stable metadata for scatter grid
const SCATTER_META = GALLERY_PHOTOS.map((src, i) => ({
  src,
  rot: (((i * 73 + 17) % 25) - 12).toFixed(1), // -12° .. +12°
  from:
    i % 3 === 0
      ? "translateX(-220px)"
      : i % 3 === 1
        ? "translateX(220px)"
        : "translateY(110px)",
  delay: (i % 4) * 80, // 0..240ms стаггер
  offsetY: (i * 47 + 13) % 80, // вертикальный сдвиг
}));

function ScatterPhoto({ meta }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scatter-photo ${vis ? "vis" : ""}`}
      style={{
        "--from": meta.from,
        "--rot": `${meta.rot}deg`,
        "--delay": `${meta.delay}ms`,
        marginTop: `${meta.offsetY}px`,
      }}
    >
      <div className="scatter-polaroid">
        <img src={meta.src} alt="" loading="lazy" draggable={false} />
      </div>
    </div>
  );
}

function PhotoFinale() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="photo-finale">
      {/* 3 overlapping polaroids */}
      <div ref={ref}>
        <div className={`finale-label ${vis ? "vis" : ""}`}>
          <span className="divider-star">✦</span>
          <span>и ещё немного</span>
          <span className="divider-star">✦</span>
        </div>
        <div className="finale-collage">
          {FINALE_PHOTOS.map(({ file, cls }) => (
            <div
              key={cls}
              className={`finale-photo ${cls} ${vis ? "vis" : ""}`}
            >
              <img
                src={`${BASE}photos/${file}`}
                alt=""
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scattered gallery below */}
      <div className="scatter-gallery">
        {SCATTER_META.map((meta, i) => (
          <ScatterPhoto key={i} meta={meta} />
        ))}
      </div>
    </div>
  );
}

// ─── Alternating wish row ─────────────────────
function WishRow({ wish, reverse }) {
  const rowRef = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rowRef} className={`wish-row ${reverse ? "reverse" : ""}`}>
      <div className={`row-photo ${vis ? "vis" : ""}`}>
        {wish.photo ? (
          <img src={wish.photo} alt="" loading="lazy" />
        ) : (
          <div className="row-photo-empty" />
        )}
      </div>
      <div className={`row-content ${vis ? "vis" : ""}`}>
        <p className="row-text">{wish.text}</p>
        <p className="row-from">— {wish.from}</p>
      </div>
    </div>
  );
}

// ─── Mini Game ────────────────────────────────
const MAX_RECEIPTS = 10;
const RECEIPT_LIFE = 1400;
const GAME_DURATION = 60;

function gameResultText(score) {
  if (score >= 35) return "Главбух-легенда! 🔥";
  if (score >= 20) return "Отличный результат!";
  if (score >= 10) return "Неплохо, бухгалтер!";
  return "Нужна практика 😅";
}

function MiniGame() {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | playing | done | submit
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [receipts, setReceipts] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [myKey, setMyKey] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const nextId = useRef(0);
  const spawnTimer = useRef(null);
  const countdownRef = useRef(null);
  const autoTimers = useRef(new Map());
  const phaseRef = useRef("idle");

  // Load leaderboard in real-time
  useEffect(() => {
    return onValue(ref(db, "scores"), (snap) => {
      const entries = [];
      snap.forEach((child) => { entries.push({ id: child.key, ...child.val() }); });
      entries.sort((a, b) => (b.score || 0) - (a.score || 0));
      setLeaderboard(entries.slice(0, 10));
    });
  }, []);

  const submitScore = async () => {
    if (!playerName.trim() || submitted) return;
    setSubmitted(true);
    try {
      const newRef = push(ref(db, "scores"), {
        name: playerName.trim(),
        score,
        timestamp: Date.now(),
      });
      setMyKey(newRef.key);
      await newRef;
    } catch (e) {
      setSubmitted(false);
      setMyKey(null);
      alert('Не удалось сохранить 😔 Попробуй ещё раз');
    }
  };

  const stopAll = () => {
    clearTimeout(spawnTimer.current);
    clearInterval(countdownRef.current);
    autoTimers.current.forEach((t) => clearTimeout(t));
    autoTimers.current.clear();
  };

  const removeReceipt = (id) => {
    setReceipts((r) => r.filter((x) => x.id !== id));
    autoTimers.current.delete(id);
  };

  const spawnRef = useRef(null);
  spawnRef.current = () => {
    if (phaseRef.current !== "playing") return;
    const delay = 220 + Math.random() * 250;
    spawnTimer.current = setTimeout(() => {
      if (phaseRef.current !== "playing") return;
      setReceipts((prev) => {
        if (prev.length >= MAX_RECEIPTS) return prev;
        const id = nextId.current++;
        autoTimers.current.set(
          id,
          setTimeout(() => removeReceipt(id), RECEIPT_LIFE),
        );
        return [
          ...prev,
          {
            id,
            x: 5 + Math.random() * 68,
            y: 5 + Math.random() * 68,
            caught: false,
          },
        ];
      });
      spawnRef.current();
    }, delay);
  };

  const startGame = () => {
    stopAll();
    setScore(0);
    setReceipts([]);
    setTimeLeft(GAME_DURATION);
    setSubmitted(false);
    setPlayerName("");
    setMyKey(null);
    phaseRef.current = "playing";
    setPhase("playing");

    countdownRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(countdownRef.current);
          clearTimeout(spawnTimer.current);
          autoTimers.current.forEach((tm) => clearTimeout(tm));
          autoTimers.current.clear();
          setReceipts([]);
          phaseRef.current = "done";
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current();
  };

  useEffect(() => () => stopAll(), []);

  const handleCatch = (id) => (e) => {
    e.stopPropagation();
    clearTimeout(autoTimers.current.get(id));
    autoTimers.current.delete(id);
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, caught: true } : r)),
    );
    setScore((s) => s + 1);
    setTimeout(() => removeReceipt(id), 360);
  };

  const medal =
    score >= 35 ? "🏆" : score >= 20 ? "🥇" : score >= 10 ? "🥈" : "🧾";
  const timerUrgent = timeLeft <= 10;

  return (
    <>
      {/* Idle / Done card */}
      {!revealed && (
        <div className="game-reveal-wrap">
          <div className="game-reveal-radar">
            <button
              className="game-reveal-btn"
              onClick={() => setRevealed(true)}
            >
              Нажми меня!
            </button>
          </div>
          <p className="game-reveal-hint">👆 это для всех!</p>
        </div>
      )}

      {revealed && phase === "idle" && (
        <div className="game-card">
          <button
            className="game-card-close"
            onClick={() => setRevealed(false)}
          >
            ✕
          </button>
          <div className="game-card-icon">🧾</div>
          <div className="game-card-title">Поймай неопознанный платёж!</div>
          <div className="game-card-sub">Кликай по чекам · 60 секунд</div>
          <div className="game-leaderboard">
            <div className="lb-header">Топ игроков</div>
            {leaderboard.length === 0 ? (
              <div className="lb-empty">Пока никто не играл — будь первым!</div>
            ) : (
              leaderboard.slice(0, 3).map((e, i) => (
                <div key={e.id} className="lb-row">
                  <span className="lb-rank">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="lb-name">{e.name}</span>
                  <span className="lb-score">{e.score}</span>
                </div>
              ))
            )}
          </div>
          <button className="game-start-btn" onClick={startGame}>
            Старт
          </button>
        </div>
      )}

      {revealed && phase === "done" && (
        <div className="game-card">
          <button
            className="game-card-close"
            onClick={() => setRevealed(false)}
          >
            ✕
          </button>
          <div className="game-card-icon">{medal}</div>
          <div className="game-card-title">{score} поймано!</div>
          <div className="game-card-sub">{gameResultText(score)}</div>
          {!submitted ? (
            <div className="game-submit">
              <input
                className="game-name-input"
                placeholder="Твоё имя"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitScore()}
                maxLength={20}
              />
              <button className="game-start-btn" onClick={submitScore}>
                Сохранить
              </button>
            </div>
          ) : (() => {
            const myRank = myKey ? leaderboard.findIndex(e => e.id === myKey) + 1 : 0;
            const rankMedal = myRank === 1 ? "🥇" : myRank === 2 ? "🥈" : myRank === 3 ? "🥉" : "🎯";
            return (
              <div className="game-rank-result">
                <div className="game-rank-saved">✓ Результат сохранён!</div>
                {myRank > 0 && (
                  <div className="game-rank-badge">
                    {rankMedal} Ты на {myRank}-м месте
                  </div>
                )}
              </div>
            );
          })()}
          {leaderboard.length > 0 && (
            <div className="game-leaderboard">
              {leaderboard.map((e, i) => (
                <div
                  key={e.id}
                  className={`lb-row ${e.id === myKey ? "lb-mine" : ""}`}
                >
                  <span className="lb-rank">
                    {i === 0
                      ? "🥇"
                      : i === 1
                        ? "🥈"
                        : i === 2
                          ? "🥉"
                          : `${i + 1}.`}
                  </span>
                  <span className="lb-name">{e.name}</span>
                  <span className="lb-score">{e.score}</span>
                </div>
              ))}
            </div>
          )}
          <button
            className="game-start-btn"
            style={{ marginTop: "8px" }}
            onClick={startGame}
          >
            Ещё раз
          </button>
        </div>
      )}

      {/* HUD during game */}
      {phase === "playing" && (
        <div className="game-counter">
          <span className="game-counter-icon">{medal}</span>
          <div className="game-counter-text">
            <span className="game-counter-score">{score}</span>
            <span className="game-counter-label">поймано</span>
          </div>
          {leaderboard.length > 0 && (
            <div className={`game-target ${score > leaderboard[0].score ? 'beating' : ''}`}>
              <span className="game-target-num">
                {score > leaderboard[0].score ? '🏆' : leaderboard[0].score + 1}
              </span>
              <span className="game-counter-label">
                {score > leaderboard[0].score ? 'рекорд!' : 'до №1'}
              </span>
            </div>
          )}
          <div className={`game-timer ${timerUrgent ? "urgent" : ""}`}>
            <span className="game-timer-num">{timeLeft}</span>
            <span className="game-counter-label">сек</span>
          </div>
        </div>
      )}

      {/* Receipts */}
      {receipts.map((r) => (
        <div
          key={r.id}
          className={`game-receipt ${r.caught ? "caught" : ""}`}
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
          onClick={handleCatch(r.id)}
        >
          <div className="receipt-top">
            <span className="receipt-q">❓</span>
            <div className="receipt-title">
              Неопознанный
              <br />
              платёж
            </div>
          </div>
          <div className="receipt-divider">╌╌╌╌╌╌╌╌╌╌</div>
          <div className="receipt-row">
            <span>Сумма</span>
            <span className="receipt-val">??? ₽</span>
          </div>
          <div className="receipt-row">
            <span>Статья</span>
            <span className="receipt-val">???</span>
          </div>
          <div className="receipt-footer">Заполните меня!</div>
        </div>
      ))}
    </>
  );
}

// ─── App ──────────────────────────────────────
export default function App() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app">
      <MiniGame />
      <Particles />

      {/* HERO */}
      <section className="hero">
        <div className={`hero-text ${visible ? "in" : ""}`}>
          <h1 className="hero-title">
            <span>
              С Днём Рождения, <span className="gold">Лерочка!</span>
            </span>
          </h1>
          <p className="hero-role">Богиня хаоса и неопознанных</p>
          <div className="hero-divider">
            <span className="divider-star">✦</span>
            <span className="divider-line right" />
          </div>
          <p className="hero-message">
            Ты — профессионал высочайшего класса и человек с большим сердцем.
            <br />
            Сегодня мы хотим сказать тебе: <strong>ты бесценна для нас!</strong>
          </p>
        </div>
        <div className={`hero-cutout ${visible ? "in" : ""}`}>
          <img
            src={`${BASE}photos/heder/5426876330701165040-Photoroom.png`}
            alt="Валерия"
          />
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* WISHES — alternating rows */}
      <section className="wishes-section">
        {WISHES.map((wish, i) => (
          <WishRow key={i} wish={wish} reverse={i % 2 !== 0} />
        ))}
      </section>

      {/* PHOTO FINALE */}
      <PhotoFinale />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-hearts">♥ ♥ ♥</span>
          <p className="footer-text">С любовью и уважением, твой коллектив</p>
          <p
            className="footer-text"
            style={{ marginTop: "8px", opacity: 0.75, fontSize: "13px" }}
          >
            Обещаем: впредь неопознанных не будет.
            <br />
            Но это не точно )
          </p>
          <p className="footer-year">2026</p>
        </div>
      </footer>
    </div>
  );
}
