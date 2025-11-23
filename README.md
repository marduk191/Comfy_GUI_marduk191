# ComfyUI GUI

A full-featured, user-friendly GUI for ComfyUI with a customizable interface and powerful workflow editor.

## Features

- **Main GUI Page**: Simplified interface with customizable nodes for easy workflow creation
- **Workflow Editor**: Advanced node-based editor with full graph editing capabilities
- **User Preferences**: Save and load custom node layouts
- **Workflow Management**: Save, load, and manage multiple workflows
- **ComfyUI Integration**: Seamless integration with ComfyUI backend
- **Real-time Execution**: Execute workflows directly from the GUI
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Platform Compatibility

This application is fully compatible with Windows, macOS, and Linux. All scripts and tools have been configured for cross-platform operation:

- Uses Node.js and npm (cross-platform)
- Nodemon for development auto-reload (works on all platforms)
- Path handling uses Node.js `path` module for cross-platform compatibility
- No platform-specific shell commands required

## Architecture

The application consists of two main parts:

- **Frontend**: React + TypeScript application with Vite build system
- **Backend**: Node.js + Express server that proxies requests to ComfyUI

## Prerequisites

- Node.js 18+ and npm
- ComfyUI running locally (default: http://127.0.0.1:8188)

## Installation

### Windows

1. Clone the repository:
```cmd
git clone <repository-url>
cd Comfy_GUI_marduk191
```

2. Install dependencies:
```cmd
npm install
```

This will install dependencies for both frontend and backend workspaces.

### macOS / Linux

1. Clone the repository:
```bash
git clone <repository-url>
cd Comfy_GUI_marduk191
```

2. Install dependencies:
```bash
npm install
```

This will install dependencies for both frontend and backend workspaces.

## Configuration

Create a `.env` file in the `backend` directory to configure ComfyUI connection:

```env
COMFYUI_URL=http://127.0.0.1:8188
PORT=3001
```

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:
- Frontend dev server on http://localhost:3000
- Backend API server on http://localhost:3001

### Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Start the backend server:
```bash
npm start
```

## Usage

### Main GUI Page

The Main GUI page provides a simplified interface for working with ComfyUI:

1. **Add Nodes**: Click the "Add Node" button to add nodes to your interface
2. **Configure Nodes**: Fill in the parameters for each node
3. **Save Layout**: Click "Save Layout" to persist your custom node arrangement
4. **Execute**: Click "Execute Workflow" to run your workflow in ComfyUI

### Workflow Editor Page

The Workflow Editor provides advanced workflow creation capabilities:

1. **Create Nodes**: Click nodes from the sidebar to add them to the canvas
2. **Connect Nodes**: Drag connections between node outputs and inputs
3. **Save Workflow**: Name and save your workflow for later use
4. **Load Workflow**: Load previously saved workflows from the sidebar
5. **Execute**: Click "Execute" to run the workflow

## Available Node Types

The following ComfyUI node types are pre-configured:

- **KSampler**: Sampling configuration
- **CheckpointLoaderSimple**: Load model checkpoints
- **CLIPTextEncode**: Text prompt encoding
- **VAEDecode/VAEEncode**: VAE encoding and decoding
- **SaveImage**: Save generated images
- **LoadImage**: Load input images
- **EmptyLatentImage**: Create latent images
- **LatentUpscale**: Upscale latent representations
- **ImageScale**: Scale images
- **ControlNetLoader**: Load ControlNet models
- **ControlNetApply**: Apply ControlNet
- **LoraLoader**: Load LoRA models

## Project Structure

```
Comfy_GUI_marduk191/
├── backend/
│   ├── src/
│   │   └── index.js          # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # State management
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json             # Root package.json
└── README.md
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- React Router for navigation
- React Flow for workflow editor
- Zustand for state management
- Tailwind CSS for styling
- Vite for build tooling
- Lucide React for icons

### Backend
- Node.js
- Express
- Axios for HTTP requests
- WebSocket for real-time communication
- CORS support

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save user preferences
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get specific workflow
- `POST /api/workflows` - Save new workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `/api/comfy/*` - Proxy to ComfyUI API

## Data Storage

- **User Preferences**: Stored in `user-preferences.json`
- **Workflows**: Stored as individual JSON files in the `workflows/` directory

## Development

### Adding New Node Types

To add new node types to the Main GUI:

1. Edit `frontend/src/components/AddNodeModal.tsx`
2. Add the node definition to the `commonNodeTypes` array

To add new node types to the Workflow Editor:

1. Edit `frontend/src/components/WorkflowSidebar.tsx`
2. Add the node type to the `availableNodeTypes` array

### Customizing the UI

The application uses Tailwind CSS for styling. Customize the theme in:
- `frontend/tailwind.config.js`

## Troubleshooting

### ComfyUI Connection Issues

If the app cannot connect to ComfyUI:
1. Ensure ComfyUI is running
2. Check the COMFYUI_URL in your backend `.env` file
3. Verify the backend server is running and accessible

### WebSocket Connection Issues

If real-time updates aren't working:
1. Check that ComfyUI's WebSocket is accessible
2. Ensure the backend proxy is running correctly

### Windows-Specific Issues

**Port Already in Use:**
If you see an error about ports 3000 or 3001 being in use:
1. Open Command Prompt as Administrator
2. Find the process using the port: `netstat -ano | findstr :3000`
3. Kill the process: `taskkill /PID <process-id> /F`

**Firewall Issues:**
If the frontend cannot connect to the backend:
1. Windows Firewall may be blocking the connection
2. Allow Node.js through the firewall when prompted
3. Or manually add an exception in Windows Defender Firewall settings

**Node.js Not Found:**
If you see "node is not recognized":
1. Ensure Node.js is installed from https://nodejs.org/
2. Restart your terminal after installation
3. Verify installation: `node --version` and `npm --version`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

marduk191

## Acknowledgments

- ComfyUI for the backend workflow engine
- React Flow for the node editor component
