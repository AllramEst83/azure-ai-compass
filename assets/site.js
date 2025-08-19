const sttData = {
  noise: {
    title: "Solution: Acoustic Model Adaptation",
    description:
      "To improve transcription accuracy in noisy environments or for specific accents, you must adapt the acoustic model. This is done by training with audio that is highly representative of your target use case.",
    primarySolution: {
      name: "Audio + Human-labeled Transcript",
      details:
        "The most effective data type. Provide word-for-word transcripts for audio recorded with the same microphones and in the same ambient conditions as your production environment. Even 30-60 minutes of high-quality, representative audio can yield significant improvements.",
      kind: "Acoustic",
    },
    metric: {
      name: "Word Error Rate (WER)",
      description:
        "WER measures transcription accuracy via the formula (S+I+D)/N. A high Deletion (D) or Substitution (S) rate often points to acoustic issues. A WER of 5-10% is high quality. The goal is to lower the overall WER by providing better acoustic data.",
      chartData: { S: 8, I: 2, D: 15 },
    },
  },
  jargon: {
    title: "Solution: Language Model Adaptation",
    description:
      "When the model fails to recognize domain-specific terminology, acronyms, or product names, you need to adapt the language model to expand its vocabulary.",
    primarySolution: {
      name: "Plain Text",
      details:
        "The fastest way to teach the model new words. Provide a text file with full sentences that use your jargon in context. To increase a term's importance, include it in multiple, diverse sentences. This is much faster than training with audio.",
      kind: "Language",
    },
    secondarySolution: {
      name: "Pronunciation File",
      details:
        "Essential for words with non-standard pronunciations (e.g., acronyms like 'CNTK'). This file explicitly maps the written form to its spoken form (e.g., `CNTK {TAB} c n t k`).",
      kind: "Pronunciation",
    },
    tertiarySolution: {
      name: "Terminology",
      details:
        'Improve recognition accuracy on industry-specific domains, such as medical terminology, financial, proper nouns, or IT jargon. Examples: Dinosaur names — "Colepiocephale, Piatnitzkysaurus, Yamaceratops, Bambiraptor, Linhenykus, Jeholopterus".',
      kind: "Terminology",
    },
    metric: {
      name: "Word Error Rate (WER)",
      description:
        "A high Substitution (S) rate for domain-specific words is a classic sign of a vocabulary gap. Language model adaptation directly targets and reduces these substitution errors. For lightweight vocabulary enhancement, a Phrase List can be provided at runtime.",
      chartData: { S: 20, I: 1, D: 4 },
    },
  },
  format: {
    title: "Solution: Display Text Customization",
    description:
      "If the raw transcription is lexically correct but poorly formatted for human reading (e.g., inconsistent capitalization, numbers as words), you need to apply post-processing rules.",
    primarySolution: {
      name: "Output Formatting",
      details:
        "A powerful rules-based system. Use 'Rewrite' rules to fix systematic errors (e.g., `covered 19 -> COVID-19`) or enforce capitalization. Use 'ITN' rules with regex-like patterns to define how numbers, dates, and currencies should be displayed.",
      kind: "OutputFormatting",
    },
    metric: {
      name: "Token Error Rate (TER)",
      description:
        "While WER measures raw accuracy, TER measures the accuracy of the final, formatted output. A good Output Formatting file will significantly improve your TER score even if the WER remains the same. Also consider WDER for speaker attribution accuracy.",
      chartData: { S: 5, I: 1, D: 2 },
    },
  },
};

const nmtData = {
  terms: {
    title: "Solution: Dictionaries & Training Data",
    description:
      "To fix inconsistent or incorrect translations of key terminology (e.g., product names, technical terms), you must provide explicit guidance to the model.",
    primarySolution: {
      name: "Phrase Dictionary",
      details:
        "The most reliable way to enforce consistency. This is a blunt, case-sensitive instrument that forces a specific translation for a word or phrase 100% of the time. Use it for non-negotiable terms where precision is critical.",
      kind: "Dictionary",
    },
    secondarySolution: {
      name: "Training Documents",
      details:
        "Increase the number of high-quality examples of the term used correctly in context within your training data. The model will learn the correct translation, but a dictionary provides a guarantee.",
      kind: "Training",
    },
    metric: {
      name: "BLEU Score",
      description:
        "The Bilingual Evaluation Understudy (BLEU) score measures n-gram overlap between machine and human reference translations. A score of 40-60 is high quality. The key metric is the 'delta' improvement over the baseline BLEU. Enforcing consistency directly improves this score.",
      chartData: { baseline: 35, custom: 48 },
    },
  },
  style: {
    title: "Solution: Curated Tuning & Training Data",
    description:
      "If a translation is accurate but fails to match the desired tone or style (e.g., too formal, too informal), the model must be taught the correct voice.",
    primarySolution: {
      name: "Tuning Documents",
      details:
        "This dataset has a major influence on the final style. It must be a highly representative sample of your desired output, containing fluent, prose-like sentences in the correct tone. Quality over quantity is key here (2.5k-5k sentences).",
      kind: "Tuning",
    },
    secondarySolution: {
      name: "Training Documents",
      details:
        "Your larger training set should also reflect the target style. The model learns stylistic patterns from all the data it sees, so consistency across all datasets is important.",
      kind: "Training",
    },
    metric: {
      name: "BLEU Score",
      description:
        "While BLEU primarily measures lexical overlap, a model that better matches the style of the human reference translations in the test set will naturally achieve a higher score. The goal is to close the stylistic gap.",
      chartData: { baseline: 42, custom: 51 },
    },
  },
  ambiguity: {
    title: "Solution: Contextual Training Data",
    description:
      "When a word has multiple meanings (e.g., 'bank'), and the model chooses the wrong one, it's a sign that it lacks sufficient context to make the right decision.",
    primarySolution: {
      name: "Training Documents",
      details:
        "The best way to resolve ambiguity is to provide numerous, high-quality examples of the ambiguous word used correctly in its intended context. The NMT model is designed to use surrounding words to disambiguate.",
      kind: "Training",
    },
    secondarySolution: {
      name: "Phrase Dictionary",
      details:
        "If a specific translation for an ambiguous term is *always* required in your domain, a dictionary can be used as a definitive override, removing any chance of an incorrect choice.",
      kind: "Dictionary",
    },
    metric: {
      name: "BLEU Score",
      description:
        "Correctly resolving ambiguity leads to more accurate and fluent translations. By providing better contextual clues in your training data, you directly improve the model's output, which is reflected in a higher BLEU score.",
      chartData: { baseline: 38, custom: 45 },
    },
  },
};

const sttDataTableContent = [
  {
    type: "Audio + Human-labeled Transcript",
    func: "Acoustic Model Adaptation: Improves accuracy for specific acoustic conditions (noise, accents). Essential for quantitative testing (WER).",
    best: "Provide word-for-word, high-quality transcripts. Audio must be representative of the production environment (mics, noise). Use `.wav` or `.mp3`.",
  },
  {
    type: "Plain Text",
    func: "Language Model Adaptation: Improves recognition of domain-specific vocabulary and jargon by showing them in context.",
    best: "Use full sentences, not just word lists. Add multiple sentences containing important terms to increase their weight. One utterance per line.",
  },
  {
    type: "Terminology",
    func: "Domain Vocabulary Curation: Curates industry-specific terms, proper nouns, and acronyms to bias recognition toward in-domain words.",
    best: "Compile key terms (e.g., medical, financial, IT jargon, product names) and include them repeatedly in diverse, full-sentence Plain Text examples; add Pronunciation entries for non-standard spoken forms.",
  },
  {
    type: "Structured Text (Markdown)",
    func: 'Pattern Recognition: For recognizing utterances that follow a specific pattern, like commands with variable entities (e.g., "I have a question about @product").',
    best: "Use Markdown format to define lists of items and patterns. More powerful than a simple phrase list for structured inputs.",
  },
  {
    type: "Pronunciation",
    func: "Correcting Mispronunciations: Defines the specific phonetic or spoken form of words with non-standard pronunciations (acronyms, unique names).",
    best: "A tab-separated file: `Recognized Form{TAB}Spoken Form`. Be cautious not to alter common words.",
  },
  {
    type: "Output Formatting",
    func: "Display Text Customization: Defines rules for Inverse Text Normalization (ITN), capitalization, rewrites, and profanity filtering.",
    best: "Use a single text file with sections like `#rewrite`. Powerful for correcting systematic errors or enforcing brand capitalization.",
  },
  {
    type: "Audio Only",
    func: "Acoustic Adaptation (Preview): Used when you have audio but no transcripts. Azure generates transcripts using batch transcription.",
    best: "A lower-cost entry point, but model quality depends on the quality of the auto-generated labels.",
  },
];

const nmtDataTableContent = [
  {
    type: "Training Documents",
    func: "Core Model Learning: Teaches the system your domain-specific terminology, style, and grammar. This is the foundation of the custom model.",
    best: "Be liberal. Include as much high-quality, in-domain, human-translated data as possible (min 10k sentences). Better to include more data than fall below the minimum.",
  },
  {
    type: "Tuning Documents",
    func: "Parameter Optimization: Used during training to adjust the neural network's parameters for optimal performance on your specific content.",
    best: "Be strict. This set has a major influence on quality. Must be a highly representative sample (2.5k-5k sentences) and must not overlap with other sets.",
  },
  {
    type: "Testing Documents",
    func: "Performance Evaluation: Used *after* training to calculate the BLEU score. This is the final, unbiased measure of model quality.",
    best: "Be strict. Must be optimally representative of future tasks (500-2k sentences) and must not overlap with training or tuning data.",
  },
  {
    type: "Phrase Dictionary",
    func: "Forced Translation (Word/Phrase): Forces a specific translation for a given word or short phrase, 100% of the time. Case-sensitive.",
    best: "Be restrictive. This is a blunt instrument. Use sparingly for non-negotiable terms like brand names to avoid unnatural translations.",
  },
  {
    type: "Sentence Dictionary",
    func: "Forced Translation (Sentence): Forces a specific translation for an entire sentence, 100% of the time. Case-insensitive.",
    best: "Be strict. Good for common, short, in-domain sentences like warnings or standard instructions where exact wording is critical.",
  },
];

const comparisonData = [
  {
    feature: "Primary Function",
    stt: "Converts spoken audio to written text.",
    nmt: "Translates written text from a source language to a target language.",
  },
  {
    feature: "Core Input",
    stt: "Audio stream or file (`.wav`, `.mp3`).",
    nmt: "Text string or document.",
  },
  {
    feature: "Customization Goal",
    stt: "Improve recognition of specific words, accents, and acoustic environments.",
    nmt: "Improve translation of specific terminology, style, and tone.",
  },
  {
    feature: "Primary Customization Data",
    stt: "Acoustic data (Audio + Transcripts), Language data (Plain Text), Pronunciation files.",
    nmt: "Parallel data (bilingual documents), Dictionaries.",
  },
  {
    feature: "Primary Evaluation Metric",
    stt: "Word Error Rate (WER) - Lower is better.",
    nmt: "BLEU Score - Higher is better.",
  },
  {
    feature: '"Brute Force" Control',
    stt: "Pronunciation files and Rewrite rules to force specific recognition/formatting.",
    nmt: "Phrase/Sentence Dictionaries to force specific translations.",
  },
  {
    feature: "Incremental Training",
    stt: "Not supported. Requires full retraining with combined datasets.",
    nmt: "Not supported. Requires full retraining with combined datasets.",
  },
  {
    feature: "API Integration",
    stt: "Speech SDK, Speech CLI, REST APIs.",
    nmt: "Translator Text API v3, REST APIs.",
  },
];

const roadmapData = [
  "<strong>Adopt a Data-Centric Mindset:</strong> Prioritize the systematic curation of high-quality, clean, and representative data over the simple accumulation of large, noisy datasets.",
  "<strong>Diagnose Before Treating:</strong> Use detailed evaluation metrics (WER error types, BLEU score comparison) and qualitative testing to identify the specific root cause of performance issues before applying a targeted data-driven solution.",
  "<strong>Use the Right Tool for the Job:</strong> Master the use of each specialized data type (e.g., acoustic vs. plain text, dictionary vs. training data) to solve specific problems efficiently.",
  "<strong>Architect for Iteration and Retraining:</strong> Design MLOps pipelines from the ground up to support a cycle of full, periodic retraining, as true incremental training is not supported.",
  "<strong>Continuously Balance Cost and Performance:</strong> Regularly evaluate whether the measured performance gains from customization provide a sufficient return on investment for your specific application and use case.",
];

let werChart, bleuChart;

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  setupEventListeners();
  populateAllTables();
  populateRoadmap();
  showSection("intro");
  document.querySelector('.stt-problem-btn[data-problem="noise"]').click();
  document.querySelector('.nmt-problem-btn[data-problem="terms"]').click();
}

function setupEventListeners() {
  document.querySelectorAll(".stt-problem-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => handleProblemButtonClick(e, "stt"));
  });
  document.querySelectorAll(".nmt-problem-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => handleProblemButtonClick(e, "nmt"));
  });
}

function handleProblemButtonClick(e, type) {
  const problem = e.target.dataset.problem;
  if (type === "stt") {
    updateSttSolution(problem);
  } else {
    updateNmtSolution(problem);
  }
  document
    .querySelectorAll(`.${type}-problem-btn`)
    .forEach((b) => b.classList.remove("active"));
  e.target.classList.add("active");
}

function showSection(sectionId) {
  document
    .querySelectorAll(".app-section")
    .forEach((section) => section.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
  document
    .querySelectorAll(".nav-button")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(
    `.nav-button[onclick="showSection('${sectionId}')"]`
  );
  if (activeBtn) activeBtn.classList.add("active");
}

function populateAllTables() {
  populateDataTable("stt-data-table-body", sttDataTableContent, [
    "type",
    "func",
    "best",
  ]);
  populateDataTable("nmt-data-table-body", nmtDataTableContent, [
    "type",
    "func",
    "best",
  ]);
  populateDataTable("comparison-table-body", comparisonData, [
    "feature",
    "stt",
    "nmt",
  ]);
}

function populateDataTable(tbodyId, data, columns) {
  const tableBody = document.getElementById(tbodyId);
  let html = "";
  data.forEach((row) => {
    html += '<tr class="border-b border-slate-200 hover:bg-slate-50">';
    columns.forEach((col, index) => {
      const isFirstCol = index === 0;
      const cellClass = isFirstCol ? "p-3 font-medium text-slate-800" : "p-3";
      html += `<td class="${cellClass}">${row[col]}</td>`;
    });
    html += "</tr>";
  });
  tableBody.innerHTML = html;
}

function populateRoadmap() {
  const list = document.getElementById("roadmap-list");
  list.innerHTML = roadmapData
    .map((item) => `<li class="pb-2">${item}</li>`)
    .join("");
}

function createSolutionCard(title, details, kind) {
  return `
                <div class="bg-white p-6 rounded-xl shadow-lg content-card">
                    <div class="flex justify-between items-start">
                        <h4 class="text-xl font-semibold text-slate-800">${title}</h4>
                        <span class="text-xs font-medium bg-teal-100 text-teal-800 px-2 py-1 rounded-full whitespace-nowrap">${kind}</span>
                    </div>
                    <p class="mt-2 text-slate-600">${details}</p>
                </div>
            `;
}

function updateSttSolution(problem) {
  const data = sttData[problem];
  const solutionArea = document.getElementById("stt-solution-area");

  let primaryCard = createSolutionCard(
    data.primarySolution.name,
    data.primarySolution.details,
    data.primarySolution.kind
  );
  let secondaryCard = data.secondarySolution
    ? createSolutionCard(
        data.secondarySolution.name,
        data.secondarySolution.details,
        data.secondarySolution.kind
      )
    : "";
  let tertiaryCard = data.tertiarySolution
    ? createSolutionCard(
        data.tertiarySolution.name,
        data.tertiarySolution.details,
        data.tertiarySolution.kind
      )
    : "";

  solutionArea.innerHTML = `
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <h3 class="text-2xl font-semibold text-slate-800">${data.title}</h3>
                        <p class="mt-2 text-slate-600">${data.description}</p>
                    </div>
                    ${primaryCard}
                    ${secondaryCard}
                    ${tertiaryCard}
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <h4 class="text-xl font-semibold text-center text-slate-800">${data.metric.name} Explained</h4>
                    <p class="text-sm text-center text-slate-500 mt-1 mb-4">${data.metric.description}</p>
                    <div class="chart-container">
                        <canvas id="werChart"></canvas>
                    </div>
                </div>
            `;

  renderWerChart(data.metric.chartData);
}

function updateNmtSolution(problem) {
  const data = nmtData[problem];
  const solutionArea = document.getElementById("nmt-solution-area");

  let primaryCard = createSolutionCard(
    data.primarySolution.name,
    data.primarySolution.details,
    data.primarySolution.kind
  );
  let secondaryCard = data.secondarySolution
    ? createSolutionCard(
        data.secondarySolution.name,
        data.secondarySolution.details,
        data.secondarySolution.kind
      )
    : "";

  solutionArea.innerHTML = `
                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-xl shadow-lg">
                        <h3 class="text-2xl font-semibold text-slate-800">${data.title}</h3>
                        <p class="mt-2 text-slate-600">${data.description}</p>
                    </div>
                    ${primaryCard}
                    ${secondaryCard}
                </div>
                <div class="bg-white p-6 rounded-xl shadow-lg">
                    <h4 class="text-xl font-semibold text-center text-slate-800">${data.metric.name} Explained</h4>
                    <p class="text-sm text-center text-slate-500 mt-1 mb-4">${data.metric.description}</p>
                    <div class="chart-container">
                        <canvas id="bleuChart"></canvas>
                    </div>
                </div>
            `;

  renderBleuChart(data.metric.chartData);
}

function renderWerChart(chartData) {
  const ctx = document.getElementById("werChart").getContext("2d");
  if (werChart) werChart.destroy();
  const totalWer = chartData.S + chartData.I + chartData.D;
  werChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Word Error Rate Breakdown"],
      datasets: [
        {
          label: "Substitutions (S)",
          data: [chartData.S],
          backgroundColor: "rgba(251, 146, 60, 0.7)",
        },
        {
          label: "Insertions (I)",
          data: [chartData.I],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
        },
        {
          label: "Deletions (D)",
          data: [chartData.D],
          backgroundColor: "rgba(168, 85, 247, 0.7)",
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, title: { display: true, text: "Error Count (%)" } },
        y: { stacked: true },
      },
      plugins: {
        title: {
          display: true,
          text: `Total WER: ${totalWer}%`,
          font: { size: 16 },
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label || ""}: ${context.parsed.x || 0}%`,
          },
        },
      },
    },
  });
}

function renderBleuChart(chartData) {
  const ctx = document.getElementById("bleuChart").getContext("2d");
  if (bleuChart) bleuChart.destroy();
  bleuChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Baseline Model", "Custom Model"],
      datasets: [
        {
          label: "BLEU Score (Higher is Better)",
          data: [chartData.baseline, chartData.custom],
          backgroundColor: [
            "rgba(107, 114, 128, 0.6)",
            "rgba(20, 184, 166, 0.6)",
          ],
          borderColor: ["rgba(107, 114, 128, 1)", "rgba(20, 184, 166, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          title: { display: true, text: "BLEU Score" },
        },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Improvement: +${
            chartData.custom - chartData.baseline
          } BLEU Points`,
          font: { size: 16 },
        },
      },
    },
  });
}
