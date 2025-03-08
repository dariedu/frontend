import React from "react";
import { createRoot, unmountComponentAtNode } from "react-dom/client";
import {act} from 'react';

import Hello from "../../frontend/src/hello";

let container = null;
beforeEach(() => {
  // подготавливаем DOM-элемент, куда будем рендерить
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // подчищаем после завершения
  createRoot(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    createRoot(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    createRoot(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    createRoot(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});