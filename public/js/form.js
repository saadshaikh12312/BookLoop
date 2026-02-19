document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("imageInput");
  const preview = document.getElementById("cropPreview");
  const form = document.querySelector("form");

  // If page does not contain the form → exit safely
  if (!input || !preview || !form) return;

  let cropper;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = "block";

      if (cropper) cropper.destroy();

      cropper = new Cropper(preview, {
        aspectRatio: 2 / 3,
        viewMode: 1,
        autoCropArea: 1,
      });
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", () => {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      width: 600,
      height: 900,
    });

    document.getElementById("croppedImage").value =
      canvas.toDataURL("image/jpeg");
  });
});
