import { useEffect, useState } from 'react';
import { Plus, X, Save, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import NodeCard from '../components/NodeCard';
import AddNodeModal from '../components/AddNodeModal';
import axios from 'axios';

export default function MainGUI() {
  const { customNodes, loadPreferences, savePreferences } = useStore();
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [nodeValues, setNodeValues] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const handleNodeValueChange = (nodeId: string, inputName: string, value: any) => {
    setNodeValues((prev) => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [inputName]: value,
      },
    }));
  };

  const handleSaveLayout = async () => {
    await savePreferences();
    alert('Layout saved successfully!');
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      // Build workflow from custom nodes and their values
      const workflow: any = {
        nodes: customNodes.map((node, index) => ({
          id: String(index + 1),
          type: node.type,
          pos: [node.position?.x || 0, node.position?.y || 0],
          size: [200, 100],
          inputs: node.inputs.map((input) => ({
            name: input.name,
            type: input.type,
            value: nodeValues[node.id]?.[input.name] ?? input.default,
          })),
        })),
      };

      // Send to ComfyUI
      const response = await axios.post('/api/comfy/prompt', {
        prompt: workflow,
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
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddNodeModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Node</span>
          </button>
          <button
            onClick={handleSaveLayout}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Save size={20} />
            <span>Save Layout</span>
          </button>
        </div>
        <button
          onClick={handleExecute}
          disabled={isExecuting || customNodes.length === 0}
          className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          <Play size={20} />
          <span>{isExecuting ? 'Executing...' : 'Execute Workflow'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {customNodes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <LayoutGrid size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No nodes added yet</p>
                <p className="text-sm mt-2">Click "Add Node" to get started</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customNodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                values={nodeValues[node.id] || {}}
                onValueChange={(inputName, value) =>
                  handleNodeValueChange(node.id, inputName, value)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Node Modal */}
      {isAddNodeModalOpen && (
        <AddNodeModal onClose={() => setIsAddNodeModalOpen(false)} />
      )}
    </div>
  );
}
