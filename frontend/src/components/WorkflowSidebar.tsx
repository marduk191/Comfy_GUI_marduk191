import { useState, useEffect } from 'react';
import { X, Plus, Trash2, FolderOpen } from 'lucide-react';
import { useStore } from '../store/useStore';

interface WorkflowSidebarProps {
  onClose: () => void;
  onAddNode: (type: string) => void;
}

const availableNodeTypes = [
  'KSampler',
  'CheckpointLoaderSimple',
  'CLIPTextEncode',
  'VAEDecode',
  'VAEEncode',
  'SaveImage',
  'LoadImage',
  'EmptyLatentImage',
  'LatentUpscale',
  'ImageScale',
  'ControlNetLoader',
  'ControlNetApply',
  'LoraLoader',
];

export default function WorkflowSidebar({ onClose, onAddNode }: WorkflowSidebarProps) {
  const { workflows, loadWorkflows, deleteWorkflow, loadWorkflow } = useStore();
  const [activeTab, setActiveTab] = useState<'nodes' | 'workflows'>('nodes');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const filteredNodeTypes = availableNodeTypes.filter((type) =>
    type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadWorkflow = async (id: string) => {
    await loadWorkflow(id);
  };

  const handleDeleteWorkflow = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this workflow?')) {
      await deleteWorkflow(id);
    }
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Sidebar</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('nodes')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'nodes'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:bg-gray-750'
          }`}
        >
          Nodes
        </button>
        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === 'workflows'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:bg-gray-750'
          }`}
        >
          Workflows
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'nodes' ? (
          <div className="p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nodes..."
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="space-y-2">
              {filteredNodeTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onAddNode(type)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left group"
                >
                  <span className="text-white">{type}</span>
                  <Plus
                    size={16}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {workflows.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p>No saved workflows</p>
              </div>
            ) : (
              <div className="space-y-2">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                  >
                    <button
                      onClick={() => handleLoadWorkflow(workflow.id)}
                      className="flex-1 text-left"
                    >
                      <div className="text-white font-medium">{workflow.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(workflow.created).toLocaleDateString()}
                      </div>
                    </button>
                    <button
                      onClick={(e) => handleDeleteWorkflow(workflow.id, e)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition-all"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
