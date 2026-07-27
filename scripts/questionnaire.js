const urlParams = new URLSearchParams(window.location.search);
const EVENT_CODE = urlParams.get("event") || "";

const questionText = document.getElementById("questionText");
const scoreInput = document.getElementById("score");
const scoreValue = document.getElementById("scoreValue");
const submitButton = document.getElementById("submitButton");
const errorMessage = document.getElementById("errorMessage");

function initialiseQuestionnaire() {
  questionText.textContent = CONFIG.question;

  [0, 2, 4, 6, 8, 10].forEach((note) => {
    const element = document.getElementById(`label${note}`);

    if (element) {
      element.textContent = CONFIG.labels[note];
    }
  });

  scoreValue.textContent = scoreInput.value;

  scoreInput.addEventListener("input", () => {
    scoreValue.textContent = scoreInput.value;
  });

  if (!EVENT_CODE) {
    errorMessage.textContent =
      "Le lien utilisé est incomplet : aucun code événement n'a été trouvé.";

    submitButton.disabled = true;
  }
}

async function submitForm() {
  if (!EVENT_CODE) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Enregistrement...";

  errorMessage.textContent = "";

  const payload = {
    eventCode: EVENT_CODE,
    activity: CONFIG.activity,
    moment: CONFIG.moment,
    question: CONFIG.question,
    note: Number(scoreInput.value)
  };

  try {
    await fetch(CONFIG.scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const separator = CONFIG.redirectPage.includes("?") ? "&" : "?";

    window.location.href =
      `${CONFIG.redirectPage}${separator}event=${encodeURIComponent(EVENT_CODE)}`;

  } catch (error) {
    console.error(error);

    submitButton.disabled = false;
    submitButton.textContent = "Valider ma réponse →";

    errorMessage.textContent =
      "La réponse n'a pas pu être enregistrée. Merci de réessayer.";
  }
}

initialiseQuestionnaire();
