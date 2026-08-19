import { useState } from 'react'
import { showToast } from '../utils'

export default function CreateCommunityFlow({ onClose }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [inviteInput, setInviteInput] = useState('')
  const [invites, setInvites] = useState([])

  const addInvite = () => {
    const v = inviteInput.trim()
    if (v && !invites.includes(v)) {
      setInvites([...invites, v])
      setInviteInput('')
    }
  }

  const removeInvite = (v) => {
    setInvites(invites.filter(i => i !== v))
  }

  const handleCreate = () => {
    if (!name.trim()) { showToast('请输入空间名称', 'error'); return }
    showToast(`空间「${name}」创建成功！已邀请 ${invites.length} 人`, 'success')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="create-space-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div className="create-space-title">创建空间</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text3)', padding: 4 }}>✕</button>
        </div>

        <div className="create-space-field">
          <label>空间名称</label>
          <input className="create-space-input" value={name} onChange={e => setName(e.target.value)}
            placeholder="给你的空间起个名字..." autoFocus
            onKeyDown={e => e.key === 'Enter' && name.trim() && document.querySelector('.desc-input')?.focus()} />
        </div>

        <div className="create-space-field">
          <label>空间简介</label>
          <textarea className="create-space-input desc-input" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="简单描述这个空间的主题..." rows={3}
            style={{ resize: 'vertical', minHeight: 60, fontFamily: 'inherit' }} />
        </div>

        <div className="create-space-field">
          <label>邀请成员</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input className="create-space-input" value={inviteInput} onChange={e => setInviteInput(e.target.value)}
              placeholder="输入昵称或手机号，回车添加"
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInvite() } }}
              style={{ flex: 1 }} />
            <button onClick={addInvite} style={{ padding: '0 14px', borderRadius: 8, border: '1px solid var(--gb)', background: 'var(--s2)', color: 'var(--teal)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>添加</button>
          </div>
          {invites.length > 0 && (
            <div className="create-space-invite-tags">
              {invites.map(v => (
                <span key={v} className="create-space-invite-tag">
                  {v}
                  <button onClick={() => removeInvite(v)} style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>✕</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="create-space-actions">
          <button className="ct" onClick={onClose} style={{ fontSize: 12, padding: '8px 16px' }}>取消</button>
          <button className="gbtn" onClick={handleCreate} style={{ fontSize: 12, padding: '8px 16px' }}>🚀 创建空间</button>
        </div>
      </div>
    </div>
  )
}
