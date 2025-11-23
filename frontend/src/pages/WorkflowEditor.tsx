import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Save, FolderOpen, Plus, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import WorkflowSidebar from '../components/WorkflowSidebar';
import axios from 'axios';

const nodeTypes = {
  // You can add custom node types here
};

export default function WorkflowEditor() {
  const { currentWorkflow, setCurrentWorkflow, saveWorkflow, loadWorkflows } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    if (currentWorkflow) {
      setNodes(currentWorkflow.nodes || []);
      setEdges(currentWorkflow.edges || []);
      setWorkflowName(currentWorkflow.name || 'Untitled Workflow');
    }
  }, [currentWorkflow]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSaveWorkflow = async () => {
    try {
      const workflow = {
        id: currentWorkflow?.id,
        name: workflowName,
        workflow: {
          nodes,
          edges,
        },
      };

      await saveWorkflow(workflow);
      alert('Workflow saved successfully!');
    } catch (error) {
      alert('Failed to save workflow');
    }
  };

  const handleAddNode = (type: string) => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: type,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      // Convert ReactFlow workflow to ComfyUI format
      const comfyWorkflow = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.data.label,
          pos: [node.position.x, node.position.y],
          size: [200, 100],
        })),
        edges: edges.map((edge) => ({
          from: edge.source,
          to: edge.target,
        })),
      };

      const response = await axios.post('/api/comfy/prompt', {
        prompt: comfyWorkflow,
      });

      console.log('Execution started:', response.data);
      alert('Workflow execution started!');
    } catch (error: any) {
      console.error('Execution failed:', error);
      alert(`Execution failed: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Sidebar */}
      {isSidebarOpen && (
        <WorkflowSidebar
          onClose={() => setIsSidebarOpen(false)}
          onAddNode={handleAddNode}
        />
      )}

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Workflow name"
            />
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Save size={20} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FolderOpen size={20} />
              <span>Workflows</span>
            </button>
          </div>
          <button
            onClick={handleExecute}
            disabled={isExecuting || nodes.length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Play size={20} />
            <span>{isExecuting ? 'Executing...' : 'Execute'}</span>
          </button>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap
              nodeColor="#4F46E5"
              maskColor="rgba(0, 0, 0, 0.5)"
              className="bg-gray-800"
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#374151" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
