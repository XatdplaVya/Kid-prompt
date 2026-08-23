import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, Key, Save, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../components/Layout';

export function Settings() {
  const { settings, updateSettings, clearLocalData } = useStore();
  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  const handleSaveKey = () => {
    updateSettings({ geminiApiKey: apiKeyInput });
    setTestResult('idle');
  };

  const handleDeleteKey = () => {
    setApiKeyInput('');
    updateSettings({ geminiApiKey: '' });
    setTestResult('idle');
  };

  const handleTestConnection = async () => {
    if (!apiKeyInput) return;
    setIsTestLoading(true);
    setTestResult('idle');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKeyInput,
        },
        body: JSON.stringify({
          prompt: 'Say "hello"',
          model: settings.model,
        }),
      });

      if (response.ok) {
        setTestResult('success');
        setTestMessage('Connection successful!');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect');
      }
    } catch (error: any) {
      setTestResult('error');
      setTestMessage(error.message);
    } finally {
      setIsTestLoading(false);
    }
  };

  const obfuscatedKey = settings.geminiApiKey 
    ? `••••••••••••${settings.geminiApiKey.slice(-4)}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto w-full pb-20 md:pb-0"
    >
      <header className="mb-8 flex items-center gap-3">
        <div className="bg-slate-800 p-3 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-slate-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Configure your AI models and app preferences.</p>
        </div>
      </header>

      <div className="space-y-8">
        {/* API Settings */}
        <section className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
            <Key className="w-5 h-5 text-indigo-400" />
            Gemini API Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                API Key
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={obfuscatedKey || "Enter your Gemini API Key"}
                  className="glass-input flex-1"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveKey} className="glass-button bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </button>
                  <button onClick={handleDeleteKey} className="glass-button bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Your key is stored securely in your browser's local storage and is never sent to our servers except to proxy requests.
              </p>
            </div>

            {settings.geminiApiKey && (
              <div>
                <button 
                  onClick={handleTestConnection}
                  disabled={isTestLoading || apiKeyInput !== settings.geminiApiKey}
                  className="glass-button text-sm w-full md:w-auto"
                >
                  {isTestLoading ? 'Testing...' : 'Test Connection'}
                </button>
                
                {testResult === 'success' && (
                  <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" /> {testMessage}
                  </div>
                )}
                {testResult === 'error' && (
                  <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4" /> {testMessage}
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4 border-t border-glass-border">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model
              </label>
              <select 
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="glass-input appearance-none"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended for speed)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Better reasoning)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Generation Defaults */}
        <section className="glass-card p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
            Generation Defaults
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Default Language</label>
              <select 
                value={settings.defaultLanguage}
                onChange={(e) => updateSettings({ defaultLanguage: e.target.value as any })}
                className="glass-input"
              >
                <option value="English">English</option>
                <option value="Myanmar">Myanmar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Default Age Group</label>
              <select 
                value={settings.defaultAge}
                onChange={(e) => updateSettings({ defaultAge: e.target.value as any })}
                className="glass-input"
              >
                <option value="3-5">3 - 5 Years</option>
                <option value="6-8">6 - 8 Years</option>
                <option value="9-12">9 - 12 Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Default Animation Style</label>
              <input 
                type="text"
                value={settings.defaultAnimationStyle}
                onChange={(e) => updateSettings({ defaultAnimationStyle: e.target.value })}
                className="glass-input"
                placeholder="e.g. Cute 3D Animation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Prompt Language</label>
              <select 
                value={settings.promptLanguage}
                onChange={(e) => updateSettings({ promptLanguage: e.target.value as any })}
                className="glass-input"
              >
                <option value="English">English (Recommended)</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Same as Story">Same as Story</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="glass-card p-6 md:p-8 border-red-500/20">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-glass-border pb-4 text-red-400">
            Data Management
          </h2>
          <p className="text-sm text-slate-400 mb-4">
            Clearing local data will permanently delete all your saved projects and settings from this browser.
          </p>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to delete all local data? This cannot be undone.')) {
                clearLocalData();
              }
            }}
            className="glass-button bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
          >
            Clear All Local Data
          </button>
        </section>
      </div>
    </motion.div>
  );
}
