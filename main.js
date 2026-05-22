const schedules = {
  small: [
    ["Мягкая подготовка", "Пн / Ср · 10:00", "45 минут"],
    ["Английский через игру", "Вт / Чт · 11:00", "40 минут"],
    ["Логика и внимание", "Сб · 12:00", "50 минут"]
  ],
  junior: [
    ["Робототехника", "Пн / Ср · 16:00", "75 минут"],
    ["School boost", "Вт / Чт · 17:00", "60 минут"],
    ["English projects", "Сб · 13:30", "70 минут"]
  ]
};

const scheduleGrid = document.querySelector(".schedule-grid");
const ageTabs = document.querySelectorAll(".age-tab");
const form = document.querySelector(".lead-form");
const statusNode = document.querySelector(".form-status");
const submitButton = document.querySelector(".submit-button");
const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");

function renderSchedule(age = "small") {
  scheduleGrid.innerHTML = schedules[age].map(([title, time, duration]) => `
    <article class="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
      <h3 class="text-xl font-black">${title}</h3>
      <p class="mt-4 text-clay font-black">${time}</p>
      <p class="mt-2 text-sm text-ink/55">${duration}</p>
    </article>
  `).join("");
}

ageTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    ageTabs.forEach((item) => item.classList.remove("bg-ink", "text-white"));
    tab.classList.add("bg-ink", "text-white");
    renderSchedule(tab.dataset.age);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";
  statusNode.className = "text-sm text-ink/60 sm:col-span-2";
  statusNode.textContent = "Заявка отправляется администратору.";

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
    });
    if (!response.ok) throw new Error("Endpoint error");
    form.reset();
    statusNode.className = "text-sm text-sage sm:col-span-2";
    statusNode.textContent = "Готово. Педагог скоро свяжется с вами.";
  } catch {
    statusNode.className = "text-sm text-clay sm:col-span-2";
    statusNode.textContent = "Для отправки подключите backend endpoint /api/lead.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Отправить заявку";
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobilePanel.classList.contains("hidden");
  mobilePanel.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

document.querySelectorAll(".mobile-panel a").forEach((link) => link.addEventListener("click", () => mobilePanel.classList.add("hidden")));

renderSchedule();
document.querySelector(".age-tab.active")?.classList.add("bg-ink", "text-white");
window.addEventListener("load", () => window.lucide?.createIcons());
