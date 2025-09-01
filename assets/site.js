import {
  sttData,
  nmtData,
  sttDataTableContent,
  nmtDataTableContent,
  comparisonData,
  roadmapData,
} from "./data.js";

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
  let quaternaryCard = data.quaternarySolution
    ? createSolutionCard(
        data.quaternarySolution.name,
        data.quaternarySolution.details,
        data.quaternarySolution.kind
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
                    ${quaternaryCard}
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

window.showSection = showSection;
