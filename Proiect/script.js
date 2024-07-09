window.onload = function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let startX, startY;
  let selectedShape = "ellipse";
  let selectedShapeIndex = null;
  const shapes = [];

  canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    startX = e.clientX - canvas.getBoundingClientRect().left;
    startY = e.clientY - canvas.getBoundingClientRect().top;
  });

  canvas.addEventListener("mousemove", function (e) {
    if (isDrawing) {
      const currentX = e.clientX - canvas.getBoundingClientRect().left;
      const currentY = e.clientY - canvas.getBoundingClientRect().top;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (selectedShape === "ellipse") {
        const radiusX = Math.abs(currentX - startX);
        const radiusY = Math.abs(currentY - startY);
        ctx.beginPath();
        ctx.ellipse(startX, startY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      } else if (selectedShape === "rectangle") {
        const width = currentX - startX;
        const height = currentY - startY;
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
      } else if (selectedShape === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
      }

      ctx.lineWidth = document.getElementById("lineWidth").value;
      ctx.strokeStyle = document.getElementById("colorPicker").value;
      ctx.stroke();
    }
  });

  canvas.addEventListener("mouseup", function () {
    isDrawing = false;
    const currentX = event.clientX - canvas.getBoundingClientRect().left;
    const currentY = event.clientY - canvas.getBoundingClientRect().top;

    const shape = {
      type: selectedShape,
      coordinates: { startX, startY, endX: currentX, endY: currentY },
      lineWidth: document.getElementById("lineWidth").value,
      color: document.getElementById("colorPicker").value,
    };

    shapes.push(shape);
    renderShapeList();
  });

  document
    .getElementById("shapeSelector")
    .addEventListener("change", function (e) {
      selectedShape = e.target.value;
    });

  document
    .getElementById("exportPngBtn")
    .addEventListener("click", function () {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "desen.png";
      link.click();
    });

  /* document
    .getElementById("exportSvgBtn")
    .addEventListener("click", function () {
      const data = new XMLSerializer().serializeToString(canvas);
      const blob = new Blob([data], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "desen.svg";
      link.click();
    });
    */

  document
    .getElementById("applyBackgroundColorBtn")
    .addEventListener("click", function () {
      const backgroundColor = document.getElementById(
        "backgroundColorPicker"
      ).value;
      canvas.style.backgroundColor = backgroundColor;
    });

  document
    .getElementById("applyPropertiesBtn")
    .addEventListener("click", function () {
      if (selectedShapeIndex !== null) {
        const newX = document.getElementById("newX").value;
        const newY = document.getElementById("newY").value;
        const newWidth = document.getElementById("newWidth").value;
        const newHeight = document.getElementById("newHeight").value;

        if (newX !== "" && newY !== "" && newWidth !== "" && newHeight !== "") {
          shapes[selectedShapeIndex].coordinates.startX = parseFloat(newX);
          shapes[selectedShapeIndex].coordinates.startY = parseFloat(newY);
          shapes[selectedShapeIndex].coordinates.endX =
            shapes[selectedShapeIndex].coordinates.startX +
            parseFloat(newWidth);
          shapes[selectedShapeIndex].coordinates.endY =
            shapes[selectedShapeIndex].coordinates.startY +
            parseFloat(newHeight);
          redrawCanvas();
        } else {
          alert(
            "Vă rugăm să completați toate câmpurile pentru a modifica proprietățile formei."
          );
        }
      } else {
        alert("Selectați o formă din listă pentru a-i modifica proprietățile.");
      }
    });

  function renderShapeList() {
    const shapeList = document.getElementById("shapeList");
    shapeList.innerHTML = "";

    shapes.forEach((shape, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Figura ${index + 1}: ${shape.type}`;

      listItem.addEventListener("click", function () {
        selectedShapeIndex = index;
        document.getElementById("newX").value =
          shapes[selectedShapeIndex].coordinates.startX;
        document.getElementById("newY").value =
          shapes[selectedShapeIndex].coordinates.startY;
        document.getElementById("newWidth").value =
          shapes[selectedShapeIndex].coordinates.endX -
          shapes[selectedShapeIndex].coordinates.startX;
        document.getElementById("newHeight").value =
          shapes[selectedShapeIndex].coordinates.endY -
          shapes[selectedShapeIndex].coordinates.startY;
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Șterge";
      deleteButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevenim propagarea evenimentului de click pentru a nu activa selectarea formei
        shapes.splice(index, 1);
        selectedShapeIndex = null; // Resetăm indexul forme selectate pentru a evita modificări nedorite
        renderShapeList();
        redrawCanvas();
      });

      listItem.appendChild(deleteButton);
      shapeList.appendChild(listItem);
    });
  }

  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape, index) => {
      if (index === selectedShapeIndex) {
        ctx.lineWidth = shape.lineWidth;
        ctx.strokeStyle = shape.color;
        if (shape.type === "ellipse") {
          const radiusX = Math.abs(
            shape.coordinates.endX - shape.coordinates.startX
          );
          const radiusY = Math.abs(
            shape.coordinates.endY - shape.coordinates.startY
          );
          ctx.beginPath();
          ctx.ellipse(
            shape.coordinates.startX,
            shape.coordinates.startY,
            radiusX,
            radiusY,
            0,
            0,
            2 * Math.PI
          );
        } else if (shape.type === "rectangle") {
          const width = shape.coordinates.endX - shape.coordinates.startX;
          const height = shape.coordinates.endY - shape.coordinates.startY;
          ctx.beginPath();
          ctx.rect(
            shape.coordinates.startX,
            shape.coordinates.startY,
            width,
            height
          );
        } else if (shape.type === "line") {
          ctx.beginPath();
          ctx.moveTo(shape.coordinates.startX, shape.coordinates.startY);
          ctx.lineTo(shape.coordinates.endX, shape.coordinates.endY);
        }
        ctx.stroke();
      }
    });
  }
};
