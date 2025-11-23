import { X } from 'lucide-react';
import { CustomNode, useStore } from '../store/useStore';

interface NodeCardProps {
  node: CustomNode;
  values: Record<string, any>;
  onValueChange: (inputName: string, value: any) => void;
}

export default function NodeCard({ node, values, onValueChange }: NodeCardProps) {
  const { removeCustomNode } = useStore();

  const renderInput = (input: { name: string; type: string; default?: any }) => {
    const value = values[input.name] ?? input.default ?? '';

    switch (input.type) {
      case 'string':
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onValueChange(input.name, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={input.name}
          />
        );
      case 'number':
      case 'int':
      case 'float':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => onValueChange(input.name, parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={input.name}
          />
        );
      case 'boolean':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onValueChange(input.name, e.target.checked)}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Enabled</span>
          </label>
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onValueChange(input.name, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            {/* Add options based on input definition */}
          </select>
        );
      default:
        return (
          <textarea
            value={value}
            onChange={(e) => onValueChange(input.name, e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder={input.name}
          />
        );
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{node.label}</h3>
          <p className="text-sm text-gray-400">{node.type}</p>
        </div>
        <button
          onClick={() => removeCustomNode(node.id)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="space-y-3">
        {node.inputs.map((input) => (
          <div key={input.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {input.name}
            </label>
            {renderInput(input)}
          </div>
        ))}
      </div>

      {node.outputs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 mb-2">Outputs:</p>
          <div className="flex flex-wrap gap-2">
            {node.outputs.map((output) => (
              <span
                key={output.name}
                className="px-2 py-1 bg-blue-600 bg-opacity-20 text-blue-400 rounded text-xs"
              >
                {output.name} ({output.type})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
