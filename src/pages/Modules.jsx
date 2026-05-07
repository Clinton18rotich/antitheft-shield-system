import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allModules, evidenceFlow, android15Restrictions } from '../data/modules';
import { CheckCircle, XCircle, AlertTriangle, ChevronRight, ChevronDown, Shield, Zap, Eye, ArrowRight } from 'lucide-react';

const Modules = () => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [activeTab, setActiveTab] = useState('modules');

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={28} color="#a78bfa" /> Module Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {allModules.length} modules • {allModules.reduce((s, m) => s + m.totalFeatures, 0)} total features
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', borderRadius: '12px', padding: '4px' }}>
          {['modules', 'evidence', 'restrictions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                transition: 'all 0.2s', textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allModules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card"
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: mod.gradient, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '24px', flexShrink: 0
                }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{mod.name}</h3>
                    <span style={{
                      fontSize: '12px', padding: '4px 10px', borderRadius: '8px',
                      background: 'rgba(52,211,153,0.1)', color: '#34d399', fontWeight: 600
                    }}>
                      {mod.totalFeatures - mod.restrictedOnAndroid15}/{mod.totalFeatures} Working
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0' }}>{mod.description}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>✅ {mod.totalFeatures - mod.restrictedOnAndroid15} working</span>
                    <span style={{ color: '#f87171' }}>🚫 {mod.restrictedOnAndroid15} blocked on Android 15</span>
                  </div>
                </div>
                <motion.div animate={{ rotate: expandedModule === mod.id ? 90 : 0 }}>
                  <ChevronRight size={20} />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedModule === mod.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                        📋 Features ({mod.totalFeatures} total)
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                        {mod.features.map((feature, fi) => (
                          <div key={fi} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                            background: 'var(--bg-primary)', borderRadius: '10px', opacity: feature.status === 'blocked' ? 0.6 : 1
                          }}>
                            {feature.status === 'working' ? (
                              <CheckCircle size={16} color="#34d399" />
                            ) : feature.status === 'restricted' ? (
                              <AlertTriangle size={16} color="#fb923c" />
                            ) : (
                              <XCircle size={16} color="#f87171" />
                            )}
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '13px', fontWeight: 500 }}>{feature.name}</span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{feature.desc}</span>
                            </div>
                            <span style={{
                              fontSize: '10px', padding: '3px 8px', borderRadius: '6px',
                              background: feature.status === 'working' ? 'rgba(52,211,153,0.1)' :
                                          feature.status === 'restricted' ? 'rgba(251,146,60,0.1)' :
                                          'rgba(248,113,113,0.1)',
                              color: feature.status === 'working' ? '#34d399' :
                                     feature.status === 'restricted' ? '#fb923c' : '#f87171'
                            }}>
                              {feature.android15}
                            </span>
                          </div>
                        ))}
                      </div>

                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '16px 0 12px' }}>📧 Command Flow</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[
                          { label: 'Trigger', detail: mod.commandFlow.trigger, color: '#f87171' },
                          { label: 'Action', detail: mod.commandFlow.action, color: '#fb923c' },
                          { label: 'Process', detail: mod.commandFlow.process, color: '#a78bfa' },
                          { label: 'Output', detail: mod.commandFlow.output, color: '#22d3ee' },
                          { label: 'Delivery', detail: mod.commandFlow.delivery, color: '#34d399' },
                        ].map((step, si) => (
                          <React.Fragment key={si}>
                            {si > 0 && <ArrowRight size={14} color="var(--text-muted)" />}
                            <div style={{ textAlign: 'center', padding: '8px' }}>
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
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: `rgba(${i < 4 ? '248,113,113' : i < 8 ? '251,146,60' : '34,211,153'}, 0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0
                }}>
                  {step.icon}
                </div>
                {i < evidenceFlow.length - 1 && (
                  <div style={{ position: 'absolute', left: '21px', top: '56px', bottom: '0', width: '2px', background: 'var(--border)' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{step.title}</span>
                    <span style={{ fontSize: '12px', color: '#22d3ee', fontFamily: 'monospace' }}>{step.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{step.action}</p>
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
              🚫 Fully Blocked Features ({android15Restrictions.fullyBlocked.length})
            </h2>
            {android15Restrictions.fullyBlocked.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < android15Restrictions.fullyBlocked.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <XCircle size={16} color="#f87171" style={{ marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.feature}</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card">
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#fb923c' }}>
              ⚠️ Restricted Features ({android15Restrictions.restricted.length})
            </h2>
            {android15Restrictions.restricted.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < android15Restrictions.restricted.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <AlertTriangle size={16} color="#fb923c" style={{ marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{item.feature}</span>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.restriction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
