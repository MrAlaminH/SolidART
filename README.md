# SolidArt-The Next Gen AI Image generation Platform 

Welcome to the SolidArt repository! SolidArt is an innovative platform that leverages artificial intelligence to turn your creative prompts into stunning visual art. Built with Next.js, this application integrates cutting-edge technologies to deliver a seamless and engaging user experience.

## Features

- **AI-Powered Image Generation**: Convert textual descriptions into beautiful images with the help of advanced AI models.
- **User Authentication**: Secure login process using NextAuth with Google OAuth integration.
- **Responsive Design**: Crafted with Tailwind CSS, the UI adapts gracefully across different devices and screen sizes.
- **Interactive Gallery**: View and manage your generated artworks in a user-friendly interface.
- **History Tracking**: Keep track of all your art generation history, allowing for easy revisits and management.

## Technology Stack

- **Next.js**: A React framework for production-level server-side rendering and generating static websites.
- **NextAuth**: Simplifies building authentication systems and is easily adaptable with various providers.
- **Prisma**: Next-generation ORM for Node.js and TypeScript, making database management straightforward and scalable.
- **Tailwind CSS**: A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.
- **PostgreSQL**: Robust and powerful open source relational database.
- **Vercel**: Optimized platform for frontends, providing global deployment in one command.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solidart.git
   cd solidart
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables:
   - Create a `.env.local` file in the root directory.
   - Add necessary configurations such as database URL, authentication keys, etc.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Navigate to `http://localhost:3000` to see the application in action.

## API Reference

### Generate Image
- **Endpoint**: `/api/generate-image`
- **Method**: POST
- **Body**: 
  ```json
  {
    "prompt": "A description of the artwork to generate"
  }
  ```
- **Description**: Generates an image based on the provided prompt using AI.

### Fetch Image History
- **Endpoint**: `/api/fetchImageHistory`
- **Method**: GET
- **Description**: Retrieves the history of generated images for the logged-in user.

## Contributing

Contributions to SolidArt are welcome! Please refer to the CONTRIBUTING.md for more details on how to submit pull requests, report issues, and make the project better.

## License

SolidArt is open-sourced software licensed under the MIT license. See the LICENSE file for more details.

## Support

If you encounter any problems or have feedback, please open an issue on the repository issue tracker. Your insights are invaluable to making SolidArt better for everyone.

Enjoy creating with SolidArt, where your imagination fuels the canvas!
