import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useStore, CustomNode } from '../store/useStore';

interface AddNodeModalProps {
  onClose: () => void;
}

// Common ComfyUI node types
const commonNodeTypes = [
  {
    type: 'KSampler',
    label: 'KSampler',
    inputs: [
      { name: 'seed', type: 'number', default: 0 },
      { name: 'steps', type: 'number', default: 20 },
      { name: 'cfg', type: 'number', default: 8 },
      { name: 'sampler_name', type: 'string', default: 'euler' },
      { name: 'scheduler', type: 'string', default: 'normal' },
      { name: 'denoise', type: 'number', default: 1.0 },
    ],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
  },
  {
    type: 'CheckpointLoaderSimple',
    label: 'Load Checkpoint',
    inputs: [{ name: 'ckpt_name', type: 'string', default: '' }],
    outputs: [
      { name: 'MODEL', type: 'MODEL' },
      { name: 'CLIP', type: 'CLIP' },
      { name: 'VAE', type: 'VAE' },
    ],
  },
  {
    type: 'CLIPTextEncode',
    label: 'CLIP Text Encode (Prompt)',
    inputs: [{ name: 'text', type: 'text', default: '' }],
    outputs: [{ name: 'CONDITIONING', type: 'CONDITIONING' }],
  },
  {
    type: 'VAEDecode',
    label: 'VAE Decode',
    inputs: [],
    outputs: [{ name: 'IMAGE', type: 'IMAGE' }],
  },
  {
    type: 'SaveImage',
    label: 'Save Image',
    inputs: [{ name: 'filename_prefix', type: 'string', default: 'ComfyUI' }],
    outputs: [],
  },
  {
    type: 'EmptyLatentImage',
    label: 'Empty Latent Image',
    inputs: [
      { name: 'width', type: 'number', default: 512 },
      { name: 'height', type: 'number', default: 512 },
      { name: 'batch_size', type: 'number', default: 1 },
    ],
    outputs: [{ name: 'LATENT', type: 'LATENT' }],
  },
];

export default function AddNodeModal({ onClose }: AddNodeModalProps) {
  const { addCustomNode } = useStore();
  const [selectedType, setSelectedType] = useState<typeof commonNodeTypes[0] | null>(null);
  const [customLabel, setCustomLabel] = useState('');

  const handleAddNode = () => {
    if (!selectedType) return;

    const newNode: CustomNode = {
      id: `node-${Date.now()}`,
      type: selectedType.type,
      label: customLabel || selectedType.label,
      inputs: selectedType.inputs,
      outputs: selectedType.outputs,
    };

    addCustomNode(newNode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add Node to Main GUI</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Node Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {commonNodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                onClick={() => {
                  setSelectedType(nodeType);
                  setCustomLabel(nodeType.label);
                }}
                className={`p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedType?.type === nodeType.type
                    ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                    : 'border-gray-700 bg-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="font-semibold text-white">{nodeType.label}</div>
                <div className="text-sm text-gray-400 mt-1">{nodeType.type}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedType && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Label (Optional)
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a custom label"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Node Details</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="mb-3">
                  <p className="text-xs text-gray-400 mb-1">Inputs:</p>
                  {selectedType.inputs.length > 0 ? (
                    <div className="space-y-1">
                      {selectedType.inputs.map((input) => (
                        <div key={input.name} className="text-sm text-white">
                          • {input.name} ({input.type})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No inputs</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Outputs:</p>
                  {selectedType.outputs.length > 0 ? (
                    <div className="space-y-1">
                      {selectedType.outputs.map((output) => (
                        <div key={output.name} className="text-sm text-white">
                          • {output.name} ({output.type})
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No outputs</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNode}
            disabled={!selectedType}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Node</span>
          </button>
        </div>
      </div>
    </div>
  );
}
