'use client'

import { useState } from 'react'
import {
  Check,
  ChevronRight,
  Clock3,
  Code2,
  FileCode2,
  FolderKanban,
  GitBranch,
  RefreshCw,
  X,
  GitMerge,
  ExternalLink,
} from 'lucide-react'
import type { ChangeRecord, Feature, Project, Task } from '@/lib/domain'
import { findFeature, recordsForFeature, recordsForTask } from '@/lib/domain'

function taskStatusTone(status: Task['status']) {
  if (status === '已完成') return 'green'
  if (status === '已取消') return 'gray'
  return 'blue'
}

function recordStatusTone(status: ChangeRecord['status']) {
  if (status === '已发布') return 'green'
  if (status === '已作废') return 'red'
  return 'gray'
}

function Badge({ children, tone = 'gray' }: { children: React.ReactNode; tone?: string }) {
  return <span className={'badge badge-' + tone}>{children}</span>
}

export function TaskDrawer({
  task,
  records,
  project,
  module,
  feature,
  allTasks = [],
  onClose,
  onRequestComplete,
  onRestore,
  onCancel,
  onNewRecord,
  onOpenTask,
}: {
  task: Task
  records: ChangeRecord[]
  project: Project
  module: { id: string; name: string }
  feature?: Feature
  allTasks?: Task[]
  onClose: () => void
  onRequestComplete: (id: string) => void
  onRestore: (id: string) => void
  onCancel: (id: string) => void
  onNewRecord: (id: string) => void
  onOpenTask?: (taskId: string) => void
}) {
  const [activeTab, setActiveTab] = useState<'task' | 'records' | 'timeline'>('task')
  const taskRecords = recordsForTask(records, task.id)
  const featureRecords = feature
    ? recordsForFeature(records, feature.id).filter((r) => r.taskId !== task.id).slice(0, 3)
    : []
  const impactFeatures =
    task.scope === '模块级'
      ? task.impactFeatureIds.map((id) => findFeature(project.id, id)).filter((item): item is Feature => Boolean(item))
      : []

  const mainTask = task.mainTaskId ? allTasks.find((t) => t.id === task.mainTaskId) : undefined
  const sourceTasks = task.sourceTaskIds ? allTasks.filter((t) => task.sourceTaskIds?.includes(t.id)) : []

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="drawer-container" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header-bar">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span className="task-id" style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
                {task.code}
              </span>
              <Badge tone={taskStatusTone(task.status)}>{task.status}</Badge>
              <Badge tone={task.priority === '高' ? 'red' : task.priority === '中' ? 'amber' : 'gray'}>
                {task.priority}优先级
              </Badge>
              <Badge tone="blue">{task.scope}</Badge>
              {task.mergeRole === 'MAIN' && <Badge tone="violet">主任务 (聚合组)</Badge>}
              {task.mergeRole === 'SOURCE' && <Badge tone="cyan">来源任务</Badge>}
            </div>
            <h2 style={{ fontSize: 18, margin: 0, color: '#1e293b', lineHeight: 1.45, fontWeight: 600 }}>
              {task.title}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="关闭" style={{ flexShrink: 0 }}>
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
            flexWrap: 'wrap',
          }}
        >
          {task.status === '未完成' && (
            <button className="primary-button" onClick={() => onRequestComplete(task.id)}>
              <Check size={15} /> 标记完成并记录迭代
            </button>
          )}
          {task.status === '未完成' && (
            <button className="secondary-button" onClick={() => onCancel(task.id)}>
              取消任务
            </button>
          )}
          {(task.status === '已完成' || task.status === '已取消') && (
            <button className="secondary-button" onClick={() => onRestore(task.id)}>
              <RefreshCw size={14} /> {task.status === '已完成' ? '重新打开任务' : '恢复任务'}
            </button>
          )}
          <button className="secondary-button" onClick={() => onNewRecord(task.id)}>
            <GitBranch size={15} /> 记录迭代
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
            background: '#ffffff',
          }}
        >
          {[
            { key: 'task', label: '任务概况' },
            { key: 'records', label: '迭代记录 (' + taskRecords.length + ')' },
            { key: 'timeline', label: '活动日志' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: activeTab === tab.key ? 600 : 500,
                color: activeTab === tab.key ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
                background: 'transparent',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="drawer-body-scroll">
          {activeTab === 'task' && (
            <>
              {task.mergeRole === 'MAIN' && (
                <div
                  className="merge-banner"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    marginBottom: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6d28d9', fontWeight: 600 }}>
                    <GitMerge size={16} /> 本任务为主任务 (聚合组)
                  </div>
                  <div style={{ fontSize: 13, color: '#4c1d95' }}>
                    本主任务关联了 {sourceTasks.length} 个来源任务，来源任务发布迭代将在此汇聚。
                  </div>
                  {sourceTasks.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                      {sourceTasks.map((src) => (
                        <button
                          key={src.id}
                          onClick={() => onOpenTask && onOpenTask(src.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: '#ffffff',
                            border: '1px solid #c4b5fd',
                            fontSize: 12,
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontWeight: 600, color: '#5b21b6' }}>
                            {src.code} {src.title}
                          </span>
                          <span style={{ color: '#7c3aed' }}>查看来源 &rarr;</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {task.mergeRole === 'SOURCE' && mainTask && (
                <div
                  className="merge-banner"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 8,
                    background: '#ecfeff',
                    border: '1px solid #a5f3fc',
                    marginBottom: 18,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0e7490' }}>
                    <GitMerge size={16} />
                    <span style={{ fontSize: 13 }}>已关联聚合主任务：<strong>{mainTask.code} {mainTask.title}</strong></span>
                  </div>
                  <button
                    onClick={() => onOpenTask && onOpenTask(mainTask.id)}
                    className="secondary-button"
                    style={{ fontSize: 12, padding: '4px 8px' }}
                  >
                    跳转主任务
                  </button>
                </div>
              )}

              <div className="drawer-section">
                <h3>任务描述</h3>
                <p style={{ lineHeight: 1.6, color: '#334155' }}>{task.description}</p>
                {task.completionNote && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      borderRadius: 6,
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#166534',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                    }}
                  >
                    <Check size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <strong>完成总结与验证记录：</strong>
                      <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>{task.completionNote}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="drawer-section">
                <h3>归属架构与属性</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  <div className="drawer-meta">
                    <span>所属项目</span>
                    <strong>{project.name}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>所属模块</span>
                    <strong>{module.name}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>关联功能</span>
                    <strong>{feature?.name ?? (task.scope === '模块级' ? '跨功能模块任务' : '未挂载特定功能')}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>任务负责人</span>
                    <strong>{task.owner}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>创建人</span>
                    <strong>{task.creator}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>创建日期</span>
                    <strong>{task.createdAt}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>截止日期</span>
                    <strong>{task.due}</strong>
                  </div>
                  <div className="drawer-meta">
                    <span>完成时间</span>
                    <strong>{task.completedAt ?? '进行中'}</strong>
                  </div>
                </div>
              </div>

              {impactFeatures.length > 0 && (
                <div className="drawer-section">
                  <h3>本任务影响的功能档案 ({impactFeatures.length})</h3>
                  <div className="drawer-impact-list">
                    {impactFeatures.map((item) => (
                      <div key={item.id}>
                        <FileCode2 size={15} />
                        <span>{item.code} · {item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="drawer-section">
                <h3>工程分支与 GitHub 证据</h3>
                {task.githubLinks.length ? (
                  <div className="feature-links">
                    {task.githubLinks.map((link) => (
                      <a
                        className="github-link evidence-link"
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <Code2 size={15} />
                        <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {link}
                        </span>
                        <ExternalLink size={13} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="empty-inline">暂未绑定 GitHub PR 或 Commit</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'records' && (
            <div className="drawer-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>本任务关联迭代记录 ({taskRecords.length})</h3>
                <button
                  className="secondary-button"
                  style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => onNewRecord(task.id)}
                >
                  <GitBranch size={13} /> 补充记录
                </button>
              </div>
              {taskRecords.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {taskRecords.map((rec) => (
                    <div
                      key={rec.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: 8,
                        padding: '14px 16px',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, color: '#2563eb' }}>v{rec.version}</span>
                          <strong style={{ fontSize: 15, color: '#1e293b' }}>{rec.title}</strong>
                        </div>
                        <Badge tone={recordStatusTone(rec.status)}>{rec.status}</Badge>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                        {rec.code} · 发布人: {rec.author} · 发布时间: {rec.publishedAt ?? '未发布草稿'}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: '#334155' }}>
                        <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6 }}>
                          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>1. 为什么改、发现了什么问题</div>
                          <div style={{ lineHeight: 1.5 }}>{rec.contextProblem}</div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6 }}>
                          <div style={{ fontWeight: 600, color: '#475569', marginBottom: 4 }}>2. 改了什么、怎么改的</div>
                          <div style={{ lineHeight: 1.5 }}>{rec.changeSolution}</div>
                        </div>

                        <div style={{ background: '#f0fdf4', padding: 10, borderRadius: 6, border: '1px solid #bbf7d0' }}>
                          <div style={{ fontWeight: 600, color: '#166534', marginBottom: 4 }}>3. 改完效果如何、如何验证</div>
                          <div style={{ lineHeight: 1.5, color: '#14532d' }}>{rec.resultVerification}</div>
                        </div>

                        {rec.leftover && (
                          <div style={{ background: '#fffbeb', padding: 10, borderRadius: 6, border: '1px solid #fde68a' }}>
                            <div style={{ fontWeight: 600, color: '#b45309', marginBottom: 4 }}>4. 还有什么遗留问题</div>
                            <div style={{ lineHeight: 1.5, color: '#78350f' }}>{rec.leftover}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8' }}>
                  <GitBranch size={32} style={{ margin: '0 auto 8px', strokeWidth: 1.5 }} />
                  <p>该任务尚未产生或发布正式迭代记录</p>
                  <button
                    className="primary-button"
                    style={{ margin: '12px auto 0' }}
                    onClick={() => onNewRecord(task.id)}
                  >
                    立即编写第一条记录
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="drawer-section">
              <h3>全流程审计轨迹</h3>
              <div className="mini-timeline">
                <span />
                <p>
                  <strong>{task.creator}</strong> 创建了任务：{task.code}
                  <small>{task.createdAt} 09:30:00</small>
                </p>
                <span />
                <p>
                  <strong>系统</strong> 挂载至 {project.name} &gt; {module.name}
                  <small>{task.createdAt} 09:30:05</small>
                </p>
                {taskRecords.map((r) => (
                  <div key={r.id} style={{ display: 'contents' }}>
                    <span />
                    <p>
                      <strong>{r.author}</strong> 发布了迭代记录「{r.title}」(v{r.version})
                      <small>{r.publishedAt ?? '今日'} 14:15:00</small>
                    </p>
                  </div>
                ))}
                {task.completedAt && (
                  <div style={{ display: 'contents' }}>
                    <span />
                    <p>
                      <strong>{task.owner}</strong> 标记完成任务并通过质量验证
                      <small>{task.completedAt} 17:00:00</small>
                    </p>
                  </div>
                )}
                {task.status === '已取消' && (
                  <div style={{ display: 'contents' }}>
                    <span />
                    <p>
                      <strong>{task.owner}</strong> 取消了该任务
                      <small>今日 16:30:00</small>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}