# News Generator with Google Gemini AI

Generate professional news titles and content with the power of Google Gemini AI.

## Features

- Generate catchy news titles based on topics
- Generate complete news articles based on titles
- Uses the latest Google Gemini 2.5 models
- Responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- A Google Gemini API key (get one from [Google AI Studio](https://ai.google.dev/))

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/idugeni/ainews.git
   cd news-generator
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory and add your Google Gemini API key:
   \`\`\`
   GEMINI_API_KEY=your_api_key_here
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Generate Titles**: Navigate to the "Generate Titles" page, enter a topic, and click "Generate Titles". Select a title to proceed to the news generation.

2. **Generate News**: Enter a title (or select one from the previous step) and click "Generate News Content". The application will create a complete news article formatted for WordPress.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)

## Technologies Used

- Next.js 15
- React 18
- Google Gemini AI
- Tailwind CSS
- shadcn/ui components

## License

This project is licensed under the MIT License - see the LICENSE file for details.
