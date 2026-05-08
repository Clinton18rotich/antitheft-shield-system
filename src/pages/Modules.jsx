import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allModules, evidenceFlow, android15Restrictions } from '../data/modules';
import { CheckCircle, XCircle, AlertTriangle, ChevronRight, Search, Download, Code, BookOpen, Copy, Check } from 'lucide-react';

const Modules = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeTab, setActiveTab] = useState('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCode, setShowCode] = useState({});
  const [copied, setCopied] = useState(null);

  const toggleCode = (key) => {
    setShowCode(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyCode = async (code, key) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Code size={28} color="#a78bfa" /> Module Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {allModules.length} modules • {allModules.reduce((s, m) => s + m.totalFeatures, 0)} features with full implementation code
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'modules', label: '📦 Modules + Code' },
          { id: 'evidence', label: '📧 Evidence Flow' },
          { id: 'restrictions', label: '🚫 Android 15' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: 'none',
              background: activeTab === tab.id ? 'var(--accent-glow)' : 'var(--bg-card)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allModules.map((mod, i) => (
            <motion.div key={mod.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card" style={{ overflow: 'hidden' }}>
              
              {/* Module Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: mod.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{mod.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{mod.description}</p>
                </div>
                <motion.div animate={{ rotate: expandedModule === mod.id ? 90 : 0 }}>
                  <ChevronRight size={20} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedModule === mod.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>

                      {/* FULL IMPLEMENTATION CODE */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}
                          onClick={() => toggleCode(`full-${mod.id}`)}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Code size={14} color="#22d3ee" />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#22d3ee' }}>
                              📝 Complete Implementation Code
                            </span>
                          </div>
                          <ChevronRight size={14} style={{ transform: showCode[`full-${mod.id}`] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </div>
                        <AnimatePresence>
                          {showCode[`full-${mod.id}`] && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                              <div style={{ position: 'relative' }}>
                                <button onClick={(e) => { e.stopPropagation(); copyCode(mod.fullCode, `full-${mod.id}`); }}
                                  style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                                  {copied === `full-${mod.id}` ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                                  {copied === `full-${mod.id}` ? 'Copied!' : 'Copy'}
                                </button>
                                <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '20px', borderRadius: '10px', fontSize: '13px', lineHeight: '1.5', overflowX: 'auto', maxHeight: '500px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                                  <code>{mod.fullCode}</code>
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Real World Use */}
                      <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <BookOpen size={14} color="#a78bfa" />
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>Real-World Application</span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{mod.realWorldUse}</p>
                      </div>

                      {/* Features with Code */}
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                        📋 Features ({mod.features.length}) - Click to expand code
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                        {mod.features.map((feature, fi) => (
                          <div key={fi}>
                            <div onClick={() => toggleCode(`${mod.id}-${fi}`)}
                              style={{
                                padding: '12px 14px', background: 'var(--bg-primary)',
                                borderRadius: '10px', opacity: feature.status === 'blocked' ? 0.6 : 1,
                                border: '1px solid var(--border)', cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {feature.status === 'working' ? <CheckCircle size={16} color="#34d399" /> :
                                 feature.status === 'restricted' ? <AlertTriangle size={16} color="#fb923c" /> :
                                 <XCircle size={16} color="#f87171" />}
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{feature.name}</span>
                                    <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px',
                                      background: feature.status === 'working' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                                      color: feature.status === 'working' ? '#34d399' : '#f87171' }}>
                                      {feature.android15}
                                    </span>
                                  </div>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>{feature.desc}</p>
                                </div>
                                <ChevronRight size={12} style={{ transform: showCode[`${mod.id}-${fi}`] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                              </div>
                            </div>
                            {/* Feature Code */}
                            <AnimatePresence>
                              {showCode[`${mod.id}-${fi}`] && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                  <div style={{ position: 'relative', marginTop: '4px' }}>
                                    <button onClick={(e) => { e.stopPropagation(); copyCode(feature.code, `${mod.id}-${fi}`); }}
                                      style={{ position: 'absolute', top: '4px', right: '4px', padding: '4px 10px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                                      {copied === `${mod.id}-${fi}` ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                                      {copied === `${mod.id}-${fi}` ? 'Copied' : 'Copy'}
                                    </button>
                                    <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', border: '1px solid #30363d', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", marginLeft: '28px' }}>
                                      <code>{feature.code}</code>
                                    </pre>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>

                      {/* Command Flow */}
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '16px 0 12px' }}>📧 Data Pipeline</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                          { label: 'Trigger', detail: mod.commandFlow.trigger, color: '#f87171' },
                          { label: 'Action', detail: mod.commandFlow.action, color: '#fb923c' },
                          { label: 'Process', detail: mod.commandFlow.process, color: '#a78bfa' },
                          { label: 'Output', detail: mod.commandFlow.output, color: '#22d3ee' },
                          { label: 'Delivery', detail: mod.commandFlow.delivery, color: '#34d399' },
                        ].map((step, si) => (
                          <React.Fragment key={si}>
                            {si > 0 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                            <div style={{ textAlign: 'center', padding: '8px', maxWidth: '150px' }}>
                              <div style={{ fontSize: '10px', color: step.color, fontWeight: 700, marginBottom: '4px' }}>{step.label}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{step.detail}</div>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="glass-card">
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>📧 Evidence Collection Flow</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {evidenceFlow.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', position: 'relative' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `rgba(${i < 4 ? '248,113,113' : i < 8 ? '251,146,60' : '34,211,153'}, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {step.icon}
                </div>
                {i < evidenceFlow.length - 1 && <div style={{ position: 'absolute', left: '21px', top: '56px', bottom: '0', width: '2px', background: 'var(--border)' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{step.title}</span>
                    <span style={{ fontSize: '12px', color: '#22d3ee', fontFamily: 'monospace' }}>{step.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{step.action}</p>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>→ {step.output}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'restrictions' && (
        <div>
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#f87171' }}>
              🚫 Fully Blocked ({android15Restrictions.fullyBlocked.length})
            </h2>
            {android15Restrictions.fullyBlocked.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < android15Restrictions.fullyBlocked.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <XCircle size={16} color="#f87171" style={{ marginTop: '2px' }} />
                <div><span style={{ fontWeight: 600, fontSize: '14px' }}>{item.feature}</span>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.reason}</p></div>
              </div>
            ))}
          </div>
          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#fb923c' }}>
              ⚠️ Restricted ({android15Restrictions.restricted.length})
            </h2>
            {android15Restrictions.restricted.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < android15Restrictions.restricted.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <AlertTriangle size={16} color="#fb923c" style={{ marginTop: '2px' }} />
                <div><span style={{ fontWeight: 600, fontSize: '14px' }}>{item.feature}</span>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.restriction}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
