export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

export function handleFormSubmit(request, e, loadingText = "Saving...") {
  e.preventDefault();

  const saveBtn = e.submitter;
  const initialText = saveBtn.textContent;
  if (initialText === loadingText) return;
  renderLoading(true, saveBtn, initialText, loadingText);
  request()
    .catch((err) => console.error(err))
    .finally(() => {
      renderLoading(false, saveBtn, initialText);
    });
}
