// Function to handle tab switching for the Genobs modal
export const setupGenobsTabs = (modalId) => {
  const modal = document.querySelector(`#${modalId}.genobs-feature`);
  if (!modal) return;

  const tabButtons = modal.querySelectorAll(".genobs-tab-button");
  const tabContents = modal.querySelectorAll(".genobs-tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Deactivate all tab buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activate the clicked tab button and its corresponding content
      button.classList.add("active");
      document.getElementById(`${targetTab}-tab`).classList.add("active");
    });
  });
};
