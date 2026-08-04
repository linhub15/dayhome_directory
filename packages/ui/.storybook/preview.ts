import type { Preview } from "@storybook/react-vite";

import "./storybook.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: "centered",
  },
};

export default preview;
