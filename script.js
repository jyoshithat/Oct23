/* ================================================================
   script.js  —  Birthday Surprise Website
   Author: Made with love ♡
   ================================================================

   ╔══════════════════════════════════════════════════════════════╗
   ║              PERSONALIZATION CONFIGURATION                   ║
   ║  Edit ONLY the values in this section.                       ║
   ║  All other code will update automatically.                   ║
   ╚══════════════════════════════════════════════════════════════╝
*/

const CONFIG = {

  // ── Your brother's name ───────────────────────────────────────
  brotherName: "Anna",
  // The age he is turning (used in headings automatically)
  age: 24,

  // ── 23 Birthday Photos celebrating his journey ────────────────
  // All photos placed inside: assets/photos/
  photos: [
    { filename: "photo1.jpeg", caption: "Always smiling, always bright ✨" },
    { filename: "photo2.jpeg", caption: "You made every moment count 💙" },
    { filename: "photo3.jpeg", caption: "Some foods are always special 💝" },
    { filename: "photo4.jpeg", caption: "Chaotic and annoying as always! 😁" },
    { filename: "photo5.jpeg", caption: "Here's to 23 amazing years of brotherhood 🥂" },
    { filename: "photo6.jpeg", caption: "Unforgettable laughter & shared jokes 😂" },
    { filename: "photo7.jpeg", caption: "The best guide and friend anyone could ask for 🌟" },
    { filename: "photo8.jpeg", caption: "Growing up together, making memories 🏡" },
    { filename: "photo9.jpeg", caption: "Your kindness always inspires me 💫" },
    { filename: "photo10.jpeg", caption: "Moments you will cherish forever 📸" },
    { filename: "photo11.jpeg", caption: "Chasing dreams and making them real 🚀" },
    { filename: "photo12.jpeg", caption: "That iconic, infectious smile 😄" },
    { filename: "photo13.jpeg", caption: "Adventures, trips, and endless stories ✈️" },
    { filename: "photo14.jpeg", caption: "A brother like no other in this world ❤️‍🩹" },
    { filename: "photo15.jpeg", caption: "Every thing you did stays as a special memory <3!" },
    { filename: "photo16.jpeg", caption: "The true one with the kindest heart 💌" },
    { filename: "photo17.jpeg", caption: "The funniest person in any room 🎈" },
    { filename: "photo18.jpeg", caption: "Countless Advices 🫠" },
    { filename: "photo19.jpeg", caption: "Always protecting, always caring 🛡️" },
    { filename: "photo20.jpeg", caption: "Through every high and low, always by my side " },
    { filename: "photo21.jpeg", caption: "Your energy lights up everywhere you go ⚡" },
    { filename: "photo22.jpeg", caption: "23 incredible chapters written 👑" },
    { filename: "photo23.jpeg", caption: "And now entering chapter 24 — Happy Birthday Anna! 🎉" },
  ],

  // ── Slideshow timing (milliseconds) ───────────────────────────
  slideshowInterval: 4000,

  // ── Final memory photo ────────────────────────────────────────
  // Place inside: assets/photos/
  memoryPhoto: "memory.jpeg",

  // Caption shown inside the polaroid frame
  memoryCaption: "Our favourite memory 💙",

  // ── Birthday video ────────────────────────────────────────────
  // Place your MP4 video inside: assets/video/
  videoFilename: "video.mp4",

  // ── Final birthday message ────────────────────────────────────
  finalMessageLine1:
    "Some memories may become old photographs, but they will always remain special. No matter how much time passes, I'm grateful to have you as my brother.",
  finalMessageLine2: "Happy 24th Birthday, Anna! ♡",

};

/* ================================================================
   END OF CONFIGURATION — Do not edit below unless you are
   comfortable with JavaScript.
   ================================================================ */


/* ── DOM references ─────────────────────────────────────────── */
const sections = {
  opening: document.getElementById("section-opening"),
  photos: document.getElementById("section-photos"),
  video: document.getElementById("section-video"),
  memory: document.getElementById("section-memory"),
};

const overlay = document.getElementById("transition-overlay");

/* ── State ──────────────────────────────────────────────────── */
let currentSlide = 0;
let slideshowTimer = null;
let isSlidePaused = false;
let seenPhotos = new Set([0]);
let hasSeenAllPhotos = false;
let hasCompletedVideo = false;
let demoSimulationTimer = null;

/* ================================================================
   INITIALIZATION — Run when DOM is ready
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  buildOpeningParticles();
  buildFloatingHearts("opening-hearts", 12);
  buildStars("opening-stars", 26);
  buildParticles("opening-particles", 10);
  wireButtons();
});

/* ── Apply configuration values ─────────────────────────────── */
function applyConfig() {
  const heading = document.getElementById("birthday-heading");
  if (heading) heading.textContent = `Happy ${CONFIG.age}th Birthday, ${CONFIG.brotherName}! 🐣`;

  const bigNum = document.getElementById("big-number");
  if (bigNum) bigNum.textContent = String(CONFIG.age);

  const openSub = document.querySelector(".opening-sub");
  if (openSub) openSub.textContent = `${CONFIG.age} looks good on you! 💙`;

  // Video source
  const videoEl = document.getElementById("birthday-video");
  if (videoEl) {
    videoEl.src = `assets/video/${CONFIG.videoFilename}`;
  }

  // Memory photo
  const memPhoto = document.getElementById("memory-photo");
  if (memPhoto) {
    memPhoto.src = `assets/photos/${CONFIG.memoryPhoto}`;
    memPhoto.alt = `A special memory with ${CONFIG.brotherName}`;
  }

  // Memory caption inside polaroid
  const polaroidCap = document.getElementById("memory-inline-caption");
  if (polaroidCap) polaroidCap.textContent = CONFIG.memoryCaption;

  // Final message
  const msgEl = document.getElementById("memory-message");
  if (msgEl) {
    msgEl.innerHTML = `
      <p>${CONFIG.finalMessageLine1}</p>
      <p class="memory-highlight">${CONFIG.finalMessageLine2}</p>
    `;
  }
}

/* ── Toast Alert Helper ─────────────────────────────────────── */
let toastTimeout = null;
function showLockToast(message, icon = "🔒") {
  const toast = document.getElementById("lock-alert-toast");
  const msgEl = document.getElementById("toast-msg");
  const iconEl = document.getElementById("toast-icon");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  if (iconEl) iconEl.textContent = icon;
  toast.classList.add("visible");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
}

/* ── Photo Progress Tracking ────────────────────────────────── */
function markPhotoSeen(index) {
  seenPhotos.add(index);
  updatePhotoProgress();
}

function updatePhotoProgress() {
  const toVideoBtn = document.getElementById("to-video-btn");
  const toVideoText = document.getElementById("to-video-text");
  const toVideoLock = toVideoBtn?.querySelector(".btn-lock-icon");
  const total = CONFIG.photos.length;

  // Mark dots as visited
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    if (seenPhotos.has(idx)) {
      dot.classList.add("viewed");
    }
  });

  // Check if all 23 photos have been seen (or reached the 23rd slide)
  if (seenPhotos.size >= total || currentSlide === total - 1) {
    hasSeenAllPhotos = true;
    if (toVideoBtn) {
      toVideoBtn.classList.remove("locked");
      toVideoBtn.classList.add("ready-pulse");
      if (toVideoLock) toVideoLock.textContent = "✨";
      if (toVideoText) toVideoText.textContent = `All ${total} Photos Viewed — Continue to Video ♡`;
    }
  } else {
    hasSeenAllPhotos = false;
    if (toVideoBtn) {
      toVideoBtn.classList.add("locked");
      toVideoBtn.classList.remove("ready-pulse");
      if (toVideoLock) toVideoLock.textContent = "🔒";
      if (toVideoText) toVideoText.textContent = `View all photos to continue (${seenPhotos.size}/${total})`;
    }
  }
}

/* ── Wire all button click events ───────────────────────────── */
function wireButtons() {
  // Section 1 → Section 2
  document.getElementById("open-surprise-btn")?.addEventListener("click", () => {
    transitionTo("photos", initPhotoSection);
  });

  // Section 2 Navigation
  document.getElementById("photo-back-btn")?.addEventListener("click", () => {
    stopSlideshow();
    transitionTo("opening");
  });

  // Continue to video button: STRICTLY requires seeing all 23 photos
  const toVideoBtn = document.getElementById("to-video-btn");
  toVideoBtn?.addEventListener("click", () => {
    if (!hasSeenAllPhotos) {
      toVideoBtn.classList.remove("shake");
      void toVideoBtn.offsetWidth; // trigger reflow
      toVideoBtn.classList.add("shake");

      showLockToast(`Please enjoy all 23 memories first! (${seenPhotos.size}/${CONFIG.photos.length})`, "📷");

      // Auto-advance to the next photo
      pauseSlideshow();
      changeSlide(currentSlide + 1);
      return;
    }
    stopSlideshow();
    transitionTo("video", initVideoSection);
  });

  // Prev slide
  document.getElementById("prev-btn")?.addEventListener("click", () => {
    pauseSlideshow();
    changeSlide(currentSlide - 1);
  });

  // Next slide
  const handleNextPhoto = () => {
    pauseSlideshow();
    if (currentSlide === CONFIG.photos.length - 1) {
      // Reached the 23rd photo: all photos viewed -> advance to video!
      hasSeenAllPhotos = true;
      stopSlideshow();
      transitionTo("video", initVideoSection);
    } else {
      changeSlide(currentSlide + 1);
    }
  };

  document.getElementById("next-btn")?.addEventListener("click", handleNextPhoto);

  // Keyboard navigation support
  window.addEventListener("keydown", (e) => {
    if (sections.photos.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        pauseSlideshow();
        changeSlide(currentSlide - 1);
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      }
    }
  });

  // Section 3: Video Controls & STRICT LOCK for Memory
  setupVideoControls();

  // Section 4 Navigation
  document.getElementById("memory-back-btn")?.addEventListener("click", () => {
    transitionTo("video", initVideoSection);
  });

  // Replay → Section 1
  document.getElementById("replay-btn")?.addEventListener("click", () => {
    replayExperience();
  });
}

/* ── Video Player & Strict Completion Gate ──────────────────── */
function setupVideoControls() {
  const videoEl = document.getElementById("birthday-video");
  const playOverlay = document.getElementById("play-overlay");
  const videoPlaceholder = document.getElementById("video-placeholder");
  const videoProgressFill = document.getElementById("video-progress-fill");
  const videoTimeText = document.getElementById("video-time-text");
  const videoStatusText = document.getElementById("video-status-text");
  const toMemoryBtn = document.getElementById("to-memory-btn");
  const toMemoryText = document.getElementById("to-memory-text");
  const videoEndedToast = document.getElementById("video-ended-toast");
  const missingBanner = document.getElementById("video-missing-banner");
  const demoSimulateBtn = document.getElementById("demo-simulate-btn");

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  playOverlay?.addEventListener("click", () => {
    if (!videoEl) return;
    videoEl.controls = true;
    if (videoPlaceholder) videoPlaceholder.classList.add("hidden");
    playOverlay.classList.add("hidden");

    videoEl.play().catch(err => {
      console.warn("Notice: video playback failed or file missing:", err);
      if (missingBanner) missingBanner.style.display = "flex";
    });
  });

  if (videoEl) {
    videoEl.addEventListener("pause", () => {
      if (!playOverlay.classList.contains("hidden") || videoEl.ended) return;
      playOverlay.classList.remove("hidden");
    });

    videoEl.addEventListener("play", () => {
      if (videoPlaceholder) videoPlaceholder.classList.add("hidden");
      playOverlay.classList.add("hidden");
    });

    // Real-time video progress tracking
    videoEl.addEventListener("timeupdate", () => {
      if (!videoEl.duration) return;
      const progress = (videoEl.currentTime / videoEl.duration);
      const percent = Math.min(100, Math.floor(progress * 100));

      if (videoProgressFill) {
        videoProgressFill.style.width = `${percent}%`;
      }

      if (videoTimeText) {
        videoTimeText.textContent = `${formatTime(videoEl.currentTime)} / ${formatTime(videoEl.duration)}`;
      }

      if (!hasCompletedVideo) {
        if (toMemoryText) {
          toMemoryText.textContent = `Watch full video to unlock (${percent}%)`;
        }
        if (videoStatusText) {
          videoStatusText.textContent = `${percent}% watched — watch full video to unlock 🔒`;
        }
      }
    });

    // STRICT COMPLETION EVENT: Triggers only after full video plays
    videoEl.addEventListener("ended", () => {
      completeVideoAndUnlock();
    });

    videoEl.addEventListener("error", () => {
      console.warn("Video file missing or unsupported in assets/video/birthday-message.mp4");
      if (missingBanner) missingBanner.style.display = "flex";
    });
  }

  // Demo simulation mode when video file not yet uploaded
  demoSimulateBtn?.addEventListener("click", () => {
    demoSimulateBtn.disabled = true;
    if (playOverlay) playOverlay.classList.add("hidden");
    if (videoPlaceholder) videoPlaceholder.classList.add("hidden");

    let progress = 0;
    if (demoSimulationTimer) clearInterval(demoSimulationTimer);

    demoSimulationTimer = setInterval(() => {
      progress += 5;
      if (videoProgressFill) videoProgressFill.style.width = `${progress}%`;
      if (toMemoryText) toMemoryText.textContent = `Simulating video... (${progress}%)`;
      if (videoTimeText) videoTimeText.textContent = `0:0${Math.floor(progress / 20)} / 0:05`;

      if (progress >= 100) {
        clearInterval(demoSimulationTimer);
        demoSimulationTimer = null;
        completeVideoAndUnlock();
      }
    }, 200);
  });

  // STRICT LOCK: Clicking "to-memory-btn" when NOT completed
  toMemoryBtn?.addEventListener("click", () => {
    if (!hasCompletedVideo) {
      toMemoryBtn.classList.remove("shake");
      void toMemoryBtn.offsetWidth;
      toMemoryBtn.classList.add("shake");

      showLockToast("Please watch the full video message to unlock the memory! 💌", "🎬");
      return;
    }

    // Video has been fully watched -> Proceed to Memory!
    transitionTo("memory", initMemorySection);
  });

  // Video Back button
  document.getElementById("video-back-btn")?.addEventListener("click", () => {
    if (videoEl) videoEl.pause();
    transitionTo("photos", initPhotoSection);
  });
}

/* ── Video Unlock & Auto-Redirect ───────────────────────────── */
function completeVideoAndUnlock() {
  hasCompletedVideo = true;

  const toMemoryBtn = document.getElementById("to-memory-btn");
  const toMemoryText = document.getElementById("to-memory-text");
  const toMemoryLock = toMemoryBtn?.querySelector(".btn-lock-icon");
  const videoStatusText = document.getElementById("video-status-text");
  const videoProgressFill = document.getElementById("video-progress-fill");
  const videoEndedToast = document.getElementById("video-ended-toast");

  if (videoProgressFill) videoProgressFill.style.width = "100%";
  if (videoStatusText) videoStatusText.textContent = "100% Watched — Memory Unlocked! ✨";

  if (toMemoryBtn) {
    toMemoryBtn.classList.remove("locked");
    toMemoryBtn.classList.add("ready-pulse");
  }
  if (toMemoryLock) toMemoryLock.textContent = "✨";
  if (toMemoryText) {
    toMemoryText.textContent = "✨ Memory Unlocked! View Final Memory ♡";
  }

  if (videoEndedToast) videoEndedToast.classList.add("visible");

  setTimeout(() => {
    if (videoEndedToast) videoEndedToast.classList.remove("visible");
    transitionTo("memory", initMemorySection);
  }, 1400);
}


/* ================================================================
   SECTION TRANSITIONS
   ================================================================ */
function transitionTo(targetKey, onArrival) {
  overlay.classList.add("active");

  setTimeout(() => {
    Object.values(sections).forEach(sec => {
      sec.classList.remove("active", "entering");
    });

    const target = sections[targetKey];
    target.classList.add("entering");
    overlay.classList.remove("active");

    setTimeout(() => {
      target.classList.remove("entering");
      target.classList.add("active");
      if (typeof onArrival === "function") onArrival();
    }, 820);

  }, 420);
}

function replayExperience() {
  stopSlideshow();

  const videoEl = document.getElementById("birthday-video");
  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
    videoEl.controls = false;
    document.getElementById("play-overlay")?.classList.remove("hidden");
    document.getElementById("video-placeholder")?.classList.remove("hidden");
  }

  // Reset video progress state
  hasCompletedVideo = false;
  const toMemoryBtn = document.getElementById("to-memory-btn");
  const toMemoryText = document.getElementById("to-memory-text");
  const videoProgressFill = document.getElementById("video-progress-fill");
  const videoStatusText = document.getElementById("video-status-text");

  if (videoProgressFill) videoProgressFill.style.width = "0%";
  if (videoStatusText) videoStatusText.textContent = "Watch until the end to unlock";

  if (toMemoryBtn) {
    toMemoryBtn.classList.add("locked");
    toMemoryBtn.classList.remove("ready-pulse");
    const lockIcon = toMemoryBtn.querySelector(".btn-lock-icon");
    if (lockIcon) lockIcon.textContent = "🔒";
  }
  if (toMemoryText) toMemoryText.textContent = "Watch full video to unlock (0%)";

  // Reset photo progress
  currentSlide = 0;
  seenPhotos = new Set([0]);
  hasSeenAllPhotos = false;

  // Flash overlay and return to opening
  overlay.classList.add("active");
  setTimeout(() => {
    Object.values(sections).forEach(sec => {
      sec.classList.remove("active", "entering");
    });
    sections.opening.classList.add("active");
    overlay.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 420);
}


/* ================================================================
   SECTION 2 — PHOTO SLIDESHOW (23 PHOTOS)
   ================================================================ */
function initPhotoSection() {
  buildSlides();
  buildDots();
  buildFloatingHearts("photo-hearts", 8);
  buildParticles("photo-particles", 8);
  currentSlide = 0;
  showSlide(currentSlide, "next");
  updatePhotoProgress();
  startSlideshow();
  animateSectionChildren("section-photos");
}

function buildSlides() {
  const stage = document.getElementById("slideshow-stage");
  if (!stage) return;
  stage.innerHTML = "";

  CONFIG.photos.forEach((photo, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.setAttribute("role", "tabpanel");
    slide.setAttribute("aria-label", `Photo ${i + 1} of ${CONFIG.photos.length}`);
    slide.setAttribute("data-index", i);

    const img = document.createElement("img");
    img.src = `assets/photos/${photo.filename}`;
    img.alt = photo.caption || `Birthday photo ${i + 1} of ${CONFIG.brotherName}`;
    img.loading = "lazy";
    img.onerror = function () {
      this.onerror = null;
      this.src = generateDataPlaceholder(photo.caption || `Memory ${i + 1}`);
    };

    slide.appendChild(img);

    if (photo.caption) {
      const cap = document.createElement("div");
      cap.className = "slide-caption";
      cap.textContent = photo.caption;
      slide.appendChild(cap);
    }

    stage.appendChild(slide);
  });
}

function buildDots() {
  const container = document.getElementById("slide-dots");
  if (!container) return;
  container.innerHTML = "";

  CONFIG.photos.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "") + (seenPhotos.has(i) ? " viewed" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to photo ${i + 1}`);
    dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
    dot.dataset.index = i;
    dot.addEventListener("click", () => {
      pauseSlideshow();
      changeSlide(i);
    });
    container.appendChild(dot);
  });
}

/* ── Slide navigation ────────────────────────────────────────── */
function showSlide(index, direction = "next") {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const counter = document.getElementById("slide-counter");

  slides.forEach((s, i) => {
    if (i === index) {
      s.classList.add("current");
      s.classList.remove("exiting");
    } else if (s.classList.contains("current")) {
      s.classList.add("exiting");
      s.classList.remove("current");
      setTimeout(() => s.classList.remove("exiting"), 700);
    }
  });

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
    d.setAttribute("aria-selected", i === index ? "true" : "false");
    if (i === index) {
      // Keep active dot visible in scrollable container
      d.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });

  if (counter) counter.textContent = `${index + 1} / ${CONFIG.photos.length}`;

  markPhotoSeen(index);
}

function changeSlide(rawIndex) {
  const total = CONFIG.photos.length;
  currentSlide = ((rawIndex % total) + total) % total;
  showSlide(currentSlide);
}

function startSlideshow() {
  stopSlideshow();
  isSlidePaused = false;
  slideshowTimer = setInterval(() => {
    if (!isSlidePaused) {
      if (currentSlide === CONFIG.photos.length - 1) {
        // 23rd photo finished interval: all 23 photos seen -> redirect to video!
        hasSeenAllPhotos = true;
        stopSlideshow();
        transitionTo("video", initVideoSection);
      } else {
        changeSlide(currentSlide + 1);
      }
    }
  }, CONFIG.slideshowInterval);
}

function stopSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }
}

function pauseSlideshow() {
  isSlidePaused = true;
  setTimeout(() => { isSlidePaused = false; }, 8000);
}


/* ================================================================
   SECTION 3 — VIDEO
   ================================================================ */
function initVideoSection() {
  buildParticles("video-particles", 6);
  animateSectionChildren("section-video");

  const videoEl = document.getElementById("birthday-video");
  if (videoEl) {
    videoEl.load();
    videoEl.controls = false;
  }
}


/* ================================================================
   SECTION 4 — MEMORY
   ================================================================ */
function initMemorySection() {
  buildFloatingHearts("memory-hearts", 10);
  buildParticles("memory-particles", 8);

  const polaroid = document.getElementById("polaroid-card");
  if (polaroid) {
    polaroid.style.animation = "none";
    void polaroid.offsetWidth; // Force reflow
    polaroid.style.animation = "";
  }

  animateSectionChildren("section-memory");
}


/* ================================================================
   PARTICLE & DECORATION BUILDERS
   ================================================================ */
function buildFloatingHearts(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const symbols = ["💙", "💝", "♡", "✨", "✦", "♥"];
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "heart-particle";
    h.textContent = symbols[i % symbols.length];
    h.style.setProperty("--left", `${5 + Math.random() * 90}%`);
    h.style.setProperty("--dur", `${5 + Math.random() * 8}s`);
    h.style.setProperty("--delay", `${Math.random() * 6}s`);
    container.appendChild(h);
  }
}

function buildStars(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "star-item";
    s.style.top = `${Math.random() * 100}%`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.setProperty("--dur", `${2 + Math.random() * 4}s`);
    s.style.setProperty("--delay", `${Math.random() * 5}s`);
    container.appendChild(s);
  }
}

function buildParticles(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 60 + Math.random() * 160;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--dur", `${6 + Math.random() * 8}s`);
    p.style.setProperty("--delay", `${Math.random() * 5}s`);
    p.style.setProperty("--tx", `${(Math.random() - 0.5) * 60}px`);
    p.style.setProperty("--ty", `${(Math.random() - 0.5) * 60}px`);
    container.appendChild(p);
  }
}

function buildOpeningParticles() {
  buildParticles("opening-particles", 10);
}

function animateSectionChildren(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const children = section.querySelectorAll(
    ".section-caption, .section-title, .slideshow-wrapper, .section-footer, .video-content > *, .memory-content > *"
  );

  children.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  });
}

function generateDataPlaceholder(label) {
  const text = label ? encodeURIComponent(label.slice(0, 24)) : "Memory";
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='500'>
    <defs>
      <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='%23FAF7EE'/>
        <stop offset='100%' stop-color='%23EDE8D0'/>
      </linearGradient>
    </defs>
    <rect width='600' height='500' fill='url(%23g)'/>
    <text x='50%' y='44%' font-family='Georgia,serif' font-size='26' fill='%232A86D3' text-anchor='middle'>📷</text>
    <text x='50%' y='56%' font-family='Georgia,serif' font-size='16' fill='%231B1814' text-anchor='middle'>${text}</text>
  </svg>`;
  return `data:image/svg+xml,${svg}`;
}
