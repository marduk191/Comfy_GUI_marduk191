import { create } from 'zustand';
import axios from 'axios';

export interface CustomNode {
  id: string;
  type: string;
  label: string;
  inputs: { name: string; type: string; default?: any }[];
  outputs: { name: string; type: string }[];
  position?: { x: number; y: number };
}

export interface Workflow {
  id?: string;
  name: string;
  nodes: any[];
  edges: any[];
}

interface Store {
  customNodes: CustomNode[];
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  preferences: any;

  // Actions
  addCustomNode: (node: CustomNode) => void;
  removeCustomNode: (id: string) => void;
  updateCustomNode: (id: string, updates: Partial<CustomNode>) => void;

  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;

  loadWorkflows: () => Promise<void>;
  saveWorkflow: (workflow: Workflow) => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;

  setCurrentWorkflow: (workflow: Workflow | null) => void;
}

const API_BASE = '/api';

export const useStore = create<Store>((set, get) => ({
  customNodes: [],
  workflows: [],
  currentWorkflow: null,
  preferences: {},

  addCustomNode: (node) =>
    set((state) => ({
      customNodes: [...state.customNodes, node],
    })),

  removeCustomNode: (id) =>
    set((state) => ({
      customNodes: state.customNodes.filter((n) => n.id !== id),
    })),

  updateCustomNode: (id, updates) =>
    set((state) => ({
      customNodes: state.customNodes.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),

  loadPreferences: async () => {
    try {
      const response = await axios.get(`${API_BASE}/preferences`);
      set({ preferences: response.data, customNodes: response.data.customNodes || [] });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  },

  savePreferences: async () => {
    try {
      const { preferences, customNodes } = get();
      await axios.post(`${API_BASE}/preferences`, {
        ...preferences,
        customNodes,
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  },

  loadWorkflows: async () => {
    try {
      const response = await axios.get(`${API_BASE}/workflows`);
      set({ workflows: response.data });
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  },

  saveWorkflow: async (workflow) => {
    try {
      const response = await axios.post(`${API_BASE}/workflows`, workflow);
      get().loadWorkflows();
      return response.data;
    } catch (error) {
      console.error('Failed to save workflow:', error);
      throw error;
    }
  },

  loadWorkflow: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/workflows/${id}`);
      set({ currentWorkflow: response.data });
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  },

  deleteWorkflow: async (id) => {
    try {
      await axios.delete(`${API_BASE}/workflows/${id}`);
      get().loadWorkflows();
    } catch (error) {
      console.error('Failed to delete workflow:', error);
    }
  },

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
}));
